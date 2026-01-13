package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.entity.DeliveryTobacco;
import com.example.hookahstaff.repository.TobaccoRepository;
import com.example.hookahstaff.repository.DeliveryRepository;
import com.example.hookahstaff.repository.DeliveryTobaccoRepository;
import com.example.hookahstaff.service.TobaccoService;
import com.example.hookahstaff.dto.BulkTobaccoDto;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.dto.BrandWithTastesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

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
    public List<Tobacco> getAllTobaccos() {
        return tobaccoRepository.findAll();
    }

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
    public Tobacco getTobaccoById(Long id) {
        return tobaccoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tobacco not found with id: " + id));
    }

    @Override
    @Transactional
    public Tobacco createTobacco(Tobacco tobacco) {
        // Получаем текущий незавершенный привоз
        Delivery currentDelivery = deliveryRepository.findCurrentDelivery()
                .orElseThrow(() -> new RuntimeException("Нет текущего незавершенного привоза"));
        
        // Ищем или создаём табак
        Tobacco existingTobacco = tobaccoRepository.findByBrandNameAndTasteAndWeightAndPrice(
                tobacco.getBrand_name(),
                tobacco.getTaste(),
                tobacco.getWeight(),
                tobacco.getPrice()
        );
        
        if (existingTobacco == null) {
            // Создаём новый табак
            tobacco.setInventoryWeight(tobacco.getWeight());
            tobacco.setIsPrimaryAddition(true);
            tobacco.setRelevanceScore(BigDecimal.valueOf(1.0));
            tobacco = tobaccoRepository.save(tobacco);
        } else {
            tobacco = existingTobacco;
        }
        
        // Создаём связь с привозом
        DeliveryTobacco deliveryTobacco = new DeliveryTobacco();
        deliveryTobacco.setDelivery(currentDelivery);
        deliveryTobacco.setTobacco(tobacco);
        deliveryTobacco.setQuantity(1);
        deliveryTobaccoRepository.save(deliveryTobacco);
        
        return tobacco;
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
    public List<Tobacco> createBulkTobaccos(BulkTobaccoDto bulkTobaccoDto) {
        // Получаем текущий незавершенный привоз
        Delivery currentDelivery = deliveryRepository.findCurrentDelivery()
                .orElseThrow(() -> new RuntimeException("Нет текущего незавершенного привоза"));
        
        List<Tobacco> createdTobaccos = new ArrayList<>();
        
        for (String taste : bulkTobaccoDto.getTastes()) {
            // Ищем или создаём табак
            Tobacco tobacco = tobaccoRepository.findByBrandNameAndTasteAndWeightAndPrice(
                    bulkTobaccoDto.getBrand_name(),
                    taste,
                    bulkTobaccoDto.getWeight(),
                    bulkTobaccoDto.getPrice()
            );
            
            if (tobacco == null) {
                tobacco = new Tobacco();
                tobacco.setBrand_name(bulkTobaccoDto.getBrand_name());
                tobacco.setTaste(taste);
                tobacco.setFortress(bulkTobaccoDto.getFortress());
                tobacco.setWeight(bulkTobaccoDto.getWeight());
                tobacco.setPrice(bulkTobaccoDto.getPrice());
                tobacco.setOrderDate(bulkTobaccoDto.getOrderDate());
                tobacco.setInventoryDate(bulkTobaccoDto.getInventoryDate());
                tobacco.setInventoryWeight(bulkTobaccoDto.getWeight());
                tobacco.setIsPrimaryAddition(true);
                tobacco.setRelevanceScore(BigDecimal.valueOf(1.0));
                tobacco = tobaccoRepository.save(tobacco);
            }
            
            // Создаём связь с привозом
            DeliveryTobacco deliveryTobacco = new DeliveryTobacco();
            deliveryTobacco.setDelivery(currentDelivery);
            deliveryTobacco.setTobacco(tobacco);
            deliveryTobacco.setQuantity(1);
            deliveryTobaccoRepository.save(deliveryTobacco);
            
            createdTobaccos.add(tobacco);
        }
        
        return createdTobaccos;
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
                // Ищем или создаём табак
                Tobacco tobacco = tobaccoRepository.findByBrandNameAndTasteAndWeightAndPrice(
                        brandDto.getBrandName(),
                        taste,
                        brandDto.getWeight(),
                        brandDto.getPrice()
                );
                
                if (tobacco == null) {
                    tobacco = new Tobacco();
                    tobacco.setBrand_name(brandDto.getBrandName());
                    tobacco.setTaste(taste);
                    tobacco.setFortress(brandDto.getFortress());
                    tobacco.setWeight(brandDto.getWeight());
                    tobacco.setPrice(brandDto.getPrice());
                    tobacco.setOrderDate(brandDto.getOrderDate());
                    tobacco.setInventoryDate(brandDto.getInventoryDate());
                    tobacco.setInventoryWeight(brandDto.getWeight());
                    tobacco.setIsPrimaryAddition(true);
                    tobacco.setRelevanceScore(BigDecimal.valueOf(1.0));
                    tobacco = tobaccoRepository.save(tobacco);
                }
                
                // Создаём связь с привозом
                DeliveryTobacco deliveryTobacco = new DeliveryTobacco();
                deliveryTobacco.setDelivery(delivery);
                deliveryTobacco.setTobacco(tobacco);
                deliveryTobacco.setQuantity(1);
                deliveryTobaccoRepository.save(deliveryTobacco);
                
                allCreatedTobaccos.add(tobacco);
            }
        }
        
        return allCreatedTobaccos;
    }

    @Override
    public List<Tobacco> getAllTobaccosSortedByBrandAndRelevance() {
        List<Tobacco> allTobaccos = tobaccoRepository.findAll();
        
        // Сортируем только по актуальности (от большей к меньшей)
        allTobaccos.sort((t1, t2) -> t2.getRelevanceScore().compareTo(t1.getRelevanceScore()));
        
        return allTobaccos;
    }
}
