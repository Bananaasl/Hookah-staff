package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.entity.DeliveryTobacco;
import com.example.hookahstaff.repository.TobaccoRepository;
import com.example.hookahstaff.repository.DeliveryRepository;
import com.example.hookahstaff.repository.DeliveryTobaccoRepository;
import com.example.hookahstaff.service.TobaccoService;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.dto.BrandWithTastesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Реализация сервиса для работы с табаками
 * 
 * <p>Табаки сразу создаются в основной таблице tobacco как уникальные записи.
 * Связь с привозами хранится в delivery_tobacco.</p>
 * 
 * @author Hookah Staff Team
 * @version 3.0
 * @since 2025-01-11
 */
@Service
@RequiredArgsConstructor
public class TobaccoServiceImpl implements TobaccoService {

    private final TobaccoRepository tobaccoRepository;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryTobaccoRepository deliveryTobaccoRepository;

    @Override
    public List<Tobacco> getCurrentTobaccos() {
        // Получаем табаки для текущего незавершенного привоза
        Delivery currentDelivery = deliveryRepository.findCurrentDelivery().orElse(null);
        if (currentDelivery == null) {
            return new ArrayList<>();
        }
        
        List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(currentDelivery.getId());
        List<Tobacco> result = new ArrayList<>();
        for (DeliveryTobacco dt : deliveryTobaccos) {
            result.add(dt.getTobacco());
        }
        
        return result;
    }

    @Override
    public Tobacco updateTobacco(Tobacco tobacco) {
        if (!tobaccoRepository.existsById(tobacco.getId())) {
            throw new RuntimeException("Tobacco not found with id: " + tobacco.getId());
        }
        return tobaccoRepository.save(tobacco);
    }

    @Override
    @Transactional
    public void deleteTobacco(Long id) {
        // Получаем текущий незавершенный привоз
        Delivery currentDelivery = deliveryRepository.findCurrentDelivery().orElse(null);
        
        if (currentDelivery != null) {
            // Удаляем связь с текущим привозом
            List<DeliveryTobacco> deliveryTobaccos = deliveryTobaccoRepository.findByDeliveryId(currentDelivery.getId());
            for (DeliveryTobacco dt : deliveryTobaccos) {
                if (dt.getTobacco().getId().equals(id)) {
                    deliveryTobaccoRepository.delete(dt);
                    return;
                }
            }
        }
        
        throw new RuntimeException("Tobacco not found in current delivery with id: " + id);
    }

    @Override
    @Transactional
    public List<Tobacco> createMultiBrandTobaccos(MultiBrandTobaccoDto multiBrandDto) {
        List<Tobacco> allCreatedTobaccos = new ArrayList<>();
        
        // Получаем привоз
        Delivery delivery = null;
        if (multiBrandDto.getDeliveryId() != null) {
            delivery = deliveryRepository.findById(multiBrandDto.getDeliveryId())
                    .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + multiBrandDto.getDeliveryId()));
        } else {
            delivery = deliveryRepository.findCurrentDelivery()
                    .orElseThrow(() -> new RuntimeException("Нет текущего незавершенного привоза"));
        }
        
        for (BrandWithTastesDto brandDto : multiBrandDto.getBrands()) {
            for (String taste : brandDto.getTastes()) {
                // Сохраняем вес для DeliveryTobacco
                Integer weight = brandDto.getWeight();
                
                // Ищем или создаём табак только по бренду и вкусу (без учета цены и веса)
                // Для оценки полки важны только бренд и вкус, цена и вес хранятся в DeliveryTobacco
                List<Tobacco> existingTobaccos = tobaccoRepository.findByBrandNameAndTaste(
                        brandDto.getBrandName(),
                        taste
                );
                Tobacco tobacco = existingTobaccos.isEmpty() ? null : existingTobaccos.get(0);
                
                if (tobacco == null) {
                    tobacco = new Tobacco();
                    tobacco.setBrand_name(brandDto.getBrandName());
                    tobacco.setTaste(taste);
                    tobacco.setFortress(brandDto.getFortress());
                    // Вес не хранится в таблице tobacco, он хранится в DeliveryTobacco
                    tobacco.setPrice(brandDto.getPrice());
                    tobacco.setOrderDate(brandDto.getOrderDate());
                    tobacco.setInventoryDate(brandDto.getInventoryDate());
                    tobacco.setInventoryWeight(null);
                    tobacco.setIsPrimaryAddition(true);
                    tobacco.setRelevanceScore(BigDecimal.valueOf(1.0));
                    tobacco = tobaccoRepository.save(tobacco);
                }
                
                // Создаём связь с привозом (с весом)
                DeliveryTobacco deliveryTobacco = new DeliveryTobacco();
                deliveryTobacco.setDelivery(delivery);
                deliveryTobacco.setTobacco(tobacco);
                deliveryTobacco.setQuantity(1);
                deliveryTobacco.setWeight(weight);
                deliveryTobaccoRepository.save(deliveryTobacco);
                
                allCreatedTobaccos.add(tobacco);
            }
        }
        
        return allCreatedTobaccos;
    }

    @Override
    public List<Tobacco> getAllTobaccosSortedByBrandAndRelevance() {
        List<Tobacco> allTobaccos = tobaccoRepository.findAll();
        
        // Группируем по бренду и вкусу, оставляя только уникальные комбинации
        // Для оценки полки не важны цена и вес - только бренд и вкус
        Map<String, Tobacco> uniqueTobaccos = new LinkedHashMap<>();
        for (Tobacco tobacco : allTobaccos) {
            String key = (tobacco.getBrand_name() != null ? tobacco.getBrand_name() : "") + "|" + 
                        (tobacco.getTaste() != null ? tobacco.getTaste() : "");
            // Если такой комбинации еще нет, или текущий табак имеет более высокую актуальность
            if (!uniqueTobaccos.containsKey(key) || 
                tobacco.getRelevanceScore().compareTo(uniqueTobaccos.get(key).getRelevanceScore()) > 0) {
                uniqueTobaccos.put(key, tobacco);
            }
        }
        
        // Преобразуем в список и сортируем по актуальности (от большей к меньшей)
        List<Tobacco> result = new ArrayList<>(uniqueTobaccos.values());
        result.sort((t1, t2) -> t2.getRelevanceScore().compareTo(t1.getRelevanceScore()));
        
        return result;
    }
}
