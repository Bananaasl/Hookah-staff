package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.DeliveryDto;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.repository.DeliveryRepository;
import com.example.hookahstaff.repository.TobaccoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private TobaccoRepository tobaccoRepository;

    public Optional<Delivery> getCurrentDelivery() {
        return deliveryRepository.findCurrentDelivery();
    }

    public List<Delivery> getFinalizedDeliveries() {
        return deliveryRepository.findFinalizedDeliveries();
    }

    @Transactional
    public Delivery createNewDelivery(String createdBy) {
        // Проверяем, есть ли уже незавершенный привоз
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

        delivery.setIsFinalized(true);
        delivery.setFinalizedAt(LocalDateTime.now());
        
        return deliveryRepository.save(delivery);
    }

    public DeliveryDto convertToDto(Delivery delivery) {
        return new DeliveryDto(
                delivery.getId(),
                delivery.getDeliveryDate(),
                delivery.getCreatedBy(),
                delivery.getIsFinalized(),
                delivery.getFinalizedAt(),
                delivery.getTobaccos()
        );
    }

    public List<Tobacco> getTobaccosByDelivery(Long deliveryId) {
        return tobaccoRepository.findByDeliveryId(deliveryId);
    }
}
