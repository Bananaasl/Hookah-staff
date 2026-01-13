package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.DeliveryDto;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.entity.DeliveryTobacco;
import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.repository.DeliveryRepository;
import com.example.hookahstaff.repository.DeliveryTobaccoRepository;
import com.example.hookahstaff.repository.TobaccoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private TobaccoRepository tobaccoRepository;
    
    @Autowired
    private DeliveryTobaccoRepository deliveryTobaccoRepository;

    public Optional<Delivery> getCurrentDelivery() {
        return deliveryRepository.findCurrentDelivery();
    }

    public List<Delivery> getFinalizedDeliveries() {
        return deliveryRepository.findFinalizedDeliveries();
    }

    @Transactional
    public Delivery createNewDelivery(String createdBy) {
        Optional<Delivery> currentDelivery = getCurrentDelivery();
        if (currentDelivery.isPresent()) {
            throw new RuntimeException("Уже существует незавершенный привоз");
        }

        Delivery delivery = new Delivery(createdBy);
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery finalizeDelivery(Long deliveryId, String finalizedBy) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Привоз не найден"));

        if (delivery.getIsFinalized()) {
            throw new RuntimeException("Привоз уже завершен");
        }

        // Получаем все табаки из текущего привоза
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(deliveryId);
        
        // Получаем все завершенные привозы (кроме текущего)
        List<Delivery> allFinalizedDeliveries = deliveryRepository.findFinalizedDeliveries();
        
        // Собираем все комбинации бренд+вкус из завершенных привозов
        Set<String> finalizedBrandTasteKeys = new HashSet<>();
        for (Delivery finalizedDelivery : allFinalizedDeliveries) {
            if (finalizedDelivery.getId().equals(deliveryId)) {
                continue; // Пропускаем текущий привоз
            }
            List<DeliveryTobacco> dts = deliveryTobaccoRepository.findByDeliveryId(finalizedDelivery.getId());
            for (DeliveryTobacco dt : dts) {
                Tobacco tobacco = dt.getTobacco();
                String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                            (tobacco.getTaste() != null ? tobacco.getTaste() : "");
                finalizedBrandTasteKeys.add(key);
            }
        }
        
        // Обновляем флаг первичности для всех табаков в текущем привозе
        for (DeliveryTobacco dt : deliveryTobaccos) {
            Tobacco tobacco = dt.getTobacco();
            String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                        (tobacco.getTaste() != null ? tobacco.getTaste() : "");
            
            // Если табак уже был в завершенных привозах, устанавливаем флаг в false
            if (finalizedBrandTasteKeys.contains(key)) {
                // Находим все табаки с таким брендом и вкусом и устанавливаем флаг в false
                List<Tobacco> sameTypeTobaccos = tobaccoRepository.findByBrandNameAndTaste(
                        tobacco.getBrand_name(),
                        tobacco.getTaste()
                );
                for (Tobacco sameTobacco : sameTypeTobaccos) {
                    if (sameTobacco.getIsPrimaryAddition()) {
                        sameTobacco.setIsPrimaryAddition(false);
                        tobaccoRepository.save(sameTobacco);
                    }
                }
            }
        }
        
        // Завершаем привоз
        delivery.setIsFinalized(true);
        delivery.setFinalizedAt(LocalDateTime.now());
        delivery = deliveryRepository.save(delivery);
        
        // Обновляем актуальность всех табаков
        updateRelevanceScoresNew(deliveryId);
        
        return delivery;
    }

    public DeliveryDto convertToDto(Delivery delivery) {
        // Получаем табаки через DeliveryTobacco (для всех привозов)
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(delivery.getId());
        List<com.example.hookahstaff.dto.DeliveryTobaccoDto> tobaccos = deliveryTobaccos.stream()
                .map(dt -> {
                    Tobacco tobacco = dt.getTobacco();
                    // Инициализируем все поля, чтобы избежать lazy loading
                    tobacco.getId();
                    tobacco.getBrand_name();
                    tobacco.getTaste();
                    tobacco.getPrice();
                    tobacco.getOrderDate();
                    // Возвращаем DTO с весом из DeliveryTobacco
                    return com.example.hookahstaff.dto.DeliveryTobaccoDto.fromTobaccoAndWeight(tobacco, dt.getWeight());
                })
                .collect(Collectors.toList());
        
        return new DeliveryDto(
                delivery.getId(),
                delivery.getDeliveryDate(),
                delivery.getCreatedBy(),
                delivery.getIsFinalized(),
                delivery.getFinalizedAt(),
                tobaccos
        );
    }

    public List<com.example.hookahstaff.dto.DeliveryTobaccoDto> getTobaccosByDelivery(Long deliveryId) {
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(deliveryId);
        return deliveryTobaccos.stream()
                .map(dt -> {
                    Tobacco tobacco = dt.getTobacco();
                    // Инициализируем все поля, чтобы избежать lazy loading
                    tobacco.getId();
                    tobacco.getBrand_name();
                    tobacco.getTaste();
                    tobacco.getPrice();
                    tobacco.getOrderDate();
                    // Возвращаем DTO с весом из DeliveryTobacco
                    return com.example.hookahstaff.dto.DeliveryTobaccoDto.fromTobaccoAndWeight(tobacco, dt.getWeight());
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelDelivery(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Привоз не найден"));

        if (delivery.getIsFinalized()) {
            throw new RuntimeException("Нельзя отменить завершенный привоз");
        }

        // Связи удалятся автоматически через CASCADE
        deliveryRepository.delete(delivery);
    }

    public Double calculateDeliveryCost(Long deliveryId) {
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(deliveryId);
        return deliveryTobaccos.stream()
                .mapToDouble(dt -> dt.getTobacco().getPrice().doubleValue() * dt.getQuantity())
                .sum();
    }

    /**
     * Обновляет оценки актуальности табаков после фиксации привоза
     * 
     * <p>Новая логика:
     * 1. Находит все уникальные табаки из текущего привоза
     * 2. Для каждого табака проверяет, был ли он в двух предыдущих привозах
     * 3. Если был хотя бы один раз - увеличивает актуальность на 1.0
     * 4. Если не был - уменьшает актуальность на 1.0
     * 5. Для всех остальных табаков, которых нет в трех последних привозах, уменьшает актуальность на 1.0
     * 6. Актуальность ограничена диапазоном от 1.0 до 5.0</p>
     * 
     * @param finalizedDeliveryId идентификатор только что завершенного привоза
     */
    @Transactional
    private void updateRelevanceScoresNew(Long finalizedDeliveryId) {
        // Получаем табаки из завершенного привоза
        List<DeliveryTobacco> currentDeliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(finalizedDeliveryId);
        
        // Собираем уникальные комбинации бренд+вкус из текущего привоза
        Set<String> currentBrandTasteKeys = new HashSet<>();
        for (DeliveryTobacco dt : currentDeliveryTobaccos) {
            Tobacco tobacco = dt.getTobacco();
            String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                        (tobacco.getTaste() != null ? tobacco.getTaste() : "");
            currentBrandTasteKeys.add(key);
        }
        
        if (currentBrandTasteKeys.isEmpty()) {
            return;
        }

        // Получаем два предыдущих завершенных привоза
        List<Delivery> previousDeliveries = deliveryRepository.findTwoPreviousFinalizedDeliveries(
                finalizedDeliveryId, 
                PageRequest.of(0, 2)
        );

        // Собираем уникальные комбинации бренд+вкус из двух предыдущих привозов
        Set<String> previousBrandTasteKeys = new HashSet<>();
        for (Delivery delivery : previousDeliveries) {
            List<DeliveryTobacco> dts = deliveryTobaccoRepository.findByDeliveryId(delivery.getId());
            for (DeliveryTobacco dt : dts) {
                Tobacco tobacco = dt.getTobacco();
                String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                            (tobacco.getTaste() != null ? tobacco.getTaste() : "");
                previousBrandTasteKeys.add(key);
            }
        }

        // 1. Увеличиваем актуальность на 1 для табаков из текущего привоза, которые есть в двух последних привозах
        for (String brandTasteKey : currentBrandTasteKeys) {
            // Если табак был в предыдущих привозах - увеличиваем актуальность
            if (previousBrandTasteKeys.contains(brandTasteKey)) {
                String[] parts = brandTasteKey.split("\\|");
                String brandName = parts.length > 0 ? parts[0] : "";
                String taste = parts.length > 1 ? parts[1] : "";
                
                // Находим все табаки с таким брендом и вкусом
                List<Tobacco> tobaccos = tobaccoRepository.findByBrandNameAndTaste(brandName, taste);
                
                for (Tobacco tobacco : tobaccos) {
                    BigDecimal currentRelevance = tobacco.getRelevanceScore();
                    if (currentRelevance == null) {
                        currentRelevance = BigDecimal.valueOf(1.0);
                    }
                    
                    // Увеличиваем на 1
                    currentRelevance = currentRelevance.add(BigDecimal.valueOf(1.0));
                    currentRelevance = limitRelevance(currentRelevance);
                    
                    tobacco.setRelevanceScore(currentRelevance);
                    tobacco.setLastRelevanceUpdate(LocalDateTime.now());
                    tobaccoRepository.save(tobacco);
                }
            }
        }

        // 2. Уменьшаем актуальность на 1 для всех табаков из tobacco, которых нет в текущем привозе
        List<Tobacco> allTobaccos = tobaccoRepository.findAll();
        for (Tobacco tobacco : allTobaccos) {
            String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                        (tobacco.getTaste() != null ? tobacco.getTaste() : "");
            
            // Если табак не в текущем привозе - уменьшаем актуальность
            if (!currentBrandTasteKeys.contains(key)) {
                BigDecimal currentRelevance = tobacco.getRelevanceScore();
                if (currentRelevance == null) {
                    currentRelevance = BigDecimal.valueOf(1.0);
                }
                
                // Уменьшаем на 1
                currentRelevance = currentRelevance.subtract(BigDecimal.valueOf(1.0));
                currentRelevance = limitRelevance(currentRelevance);
                
                tobacco.setRelevanceScore(currentRelevance);
                tobacco.setLastRelevanceUpdate(LocalDateTime.now());
                tobaccoRepository.save(tobacco);
            }
        }
    }

    /**
     * Ограничивает актуальность диапазоном от 1.0 до 5.0
     */
    private BigDecimal limitRelevance(BigDecimal relevance) {
        if (relevance.compareTo(BigDecimal.valueOf(1.0)) < 0) {
            return BigDecimal.valueOf(1.0);
        }
        if (relevance.compareTo(BigDecimal.valueOf(5.0)) > 0) {
            return BigDecimal.valueOf(5.0);
        }
        return relevance;
    }
}
