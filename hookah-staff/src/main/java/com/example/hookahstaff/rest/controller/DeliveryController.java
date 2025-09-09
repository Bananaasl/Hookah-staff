package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.dto.DeliveryDto;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentDelivery() {
        Optional<Delivery> delivery = deliveryService.getCurrentDelivery();
        if (delivery.isPresent()) {
            return ResponseEntity.ok(deliveryService.convertToDto(delivery.get()));
        } else {
            return ResponseEntity.ok(null);
        }
    }

    @GetMapping("/finalized")
    public ResponseEntity<List<DeliveryDto>> getFinalizedDeliveries() {
        List<Delivery> deliveries = deliveryService.getFinalizedDeliveries();
        List<DeliveryDto> deliveryDtos = deliveries.stream()
                .map(deliveryService::convertToDto)
                .toList();
        return ResponseEntity.ok(deliveryDtos);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewDelivery(@RequestParam String createdBy) {
        try {
            Delivery delivery = deliveryService.createNewDelivery(createdBy);
            return ResponseEntity.ok(deliveryService.convertToDto(delivery));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{deliveryId}/finalize")
    public ResponseEntity<?> finalizeDelivery(@PathVariable Long deliveryId, @RequestParam String finalizedBy) {
        try {
            Delivery delivery = deliveryService.finalizeDelivery(deliveryId, finalizedBy);
            return ResponseEntity.ok(deliveryService.convertToDto(delivery));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{deliveryId}/tobaccos")
    public ResponseEntity<List<Tobacco>> getTobaccosByDelivery(@PathVariable Long deliveryId) {
        List<Tobacco> tobaccos = deliveryService.getTobaccosByDelivery(deliveryId);
        return ResponseEntity.ok(tobaccos);
    }
}
