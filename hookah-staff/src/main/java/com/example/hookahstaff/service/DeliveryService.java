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
        
        // Обновляем флаг первичности для всех табаков в привозе
        for (DeliveryTobacco dt : deliveryTobaccos) {
            Tobacco tobacco = dt.getTobacco();
            
            // Проверяем, есть ли другие табаки с таким же брендом и вкусом
            List<Tobacco> sameTypeTobaccos = tobaccoRepository.findByBrandNameAndTaste(
                    tobacco.getBrand_name(),
                    tobacco.getTaste()
            );
            
            // Если есть больше одного табака с таким брендом и вкусом, устанавливаем флаг в false для всех
            if (sameTypeTobaccos.size() > 1) {
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
        List<Tobacco> tobaccos = deliveryTobaccos.stream()
                .map(dt -> {
                    Tobacco tobacco = dt.getTobacco();
                    // Инициализируем proxy, чтобы избежать lazy loading
                    tobacco.getId();
                    return tobacco;
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

    public List<Tobacco> getTobaccosByDelivery(Long deliveryId) {
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(deliveryId);
        return deliveryTobaccos.stream()
                .map(DeliveryTobacco::getTobacco)
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
     * 4. Если не был - уменьшает актуальность на 0.5
     * 5. Для всех остальных табаков, которых нет в трех последних привозах, уменьшает актуальность на 0.5
     * 6. Актуальность ограничена диапазоном от 1.0 до 5.0</p>
     * 
     * @param finalizedDeliveryId идентификатор только что завершенного привоза
     */
    @Transactional
    private void updateRelevanceScoresNew(Long finalizedDeliveryId) {
        // Получаем табаки из завершенного привоза
        List<DeliveryTobacco> currentDeliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(finalizedDeliveryId);
        Set<Long> currentTobaccoIds = currentDeliveryTobaccos.stream()
                .map(dt -> dt.getTobacco().getId())
                .collect(Collectors.toSet());
        
        if (currentTobaccoIds.isEmpty()) {
            return;
        }

        // Получаем два предыдущих завершенных привоза
        List<Delivery> previousDeliveries = deliveryRepository.findTwoPreviousFinalizedDeliveries(
                finalizedDeliveryId, 
                PageRequest.of(0, 2)
        );

        // Собираем табаки из предыдущих привозов
        Set<Long> previousTobaccoIds = new HashSet<>();
        for (Delivery delivery : previousDeliveries) {
            List<DeliveryTobacco> dts = deliveryTobaccoRepository.findByDeliveryId(delivery.getId());
            previousTobaccoIds.addAll(dts.stream()
                    .map(dt -> dt.getTobacco().getId())
                    .collect(Collectors.toSet()));
        }

        // Собираем все табаки из трех последних привозов (текущий + два предыдущих)
        Set<Long> recentTobaccoIds = new HashSet<>();
        recentTobaccoIds.addAll(currentTobaccoIds);
        recentTobaccoIds.addAll(previousTobaccoIds);

        // Обновляем актуальность для табаков из текущего привоза
        for (Long tobaccoId : currentTobaccoIds) {
            Tobacco tobacco = tobaccoRepository.findById(tobaccoId).orElse(null);
            if (tobacco == null) continue;
            
            BigDecimal currentRelevance = tobacco.getRelevanceScore();
            if (currentRelevance == null) {
                currentRelevance = BigDecimal.valueOf(1.0);
            }
            
            // Если табак был в предыдущих привозах - увеличиваем на 1
            if (previousTobaccoIds.contains(tobaccoId)) {
                currentRelevance = currentRelevance.add(BigDecimal.valueOf(1.0));
            } else {
                // Если табак не был в предыдущих привозах - уменьшаем на 0.5
                currentRelevance = currentRelevance.subtract(BigDecimal.valueOf(0.5));
            }
            
            // Ограничиваем диапазоном от 1.0 до 5.0
            currentRelevance = limitRelevance(currentRelevance);
            
            tobacco.setRelevanceScore(currentRelevance);
            tobacco.setLastRelevanceUpdate(LocalDateTime.now());
            tobaccoRepository.save(tobacco);
        }

        // Уменьшаем актуальность для табаков, которых нет в трех последних привозах
        List<Tobacco> allTobaccos = tobaccoRepository.findAll();
        for (Tobacco tobacco : allTobaccos) {
            if (!recentTobaccoIds.contains(tobacco.getId())) {
                BigDecimal currentRelevance = tobacco.getRelevanceScore();
                if (currentRelevance == null) {
                    currentRelevance = BigDecimal.valueOf(1.0);
                }
                
                // Уменьшаем на 0.5
                currentRelevance = currentRelevance.subtract(BigDecimal.valueOf(0.5));
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
