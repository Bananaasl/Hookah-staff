package com.example.hookahstaff.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DeliveryDto {
    private Long id;
    private LocalDateTime deliveryDate;
    private String createdBy;
    private Boolean isFinalized;
    private LocalDateTime finalizedAt;
    private List<DeliveryTobaccoDto> tobaccos; // Используем DeliveryTobaccoDto для включения weight

    public DeliveryDto() {}

    public DeliveryDto(Long id, LocalDateTime deliveryDate, String createdBy, Boolean isFinalized, LocalDateTime finalizedAt, List<DeliveryTobaccoDto> tobaccos) {
        this.id = id;
        this.deliveryDate = deliveryDate;
        this.createdBy = createdBy;
        this.isFinalized = isFinalized;
        this.finalizedAt = finalizedAt;
        this.tobaccos = tobaccos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getIsFinalized() {
        return isFinalized;
    }

    public void setIsFinalized(Boolean isFinalized) {
        this.isFinalized = isFinalized;
    }

    public LocalDateTime getFinalizedAt() {
        return finalizedAt;
    }

    public void setFinalizedAt(LocalDateTime finalizedAt) {
        this.finalizedAt = finalizedAt;
    }

    public List<DeliveryTobaccoDto> getTobaccos() {
        return tobaccos;
    }

    public void setTobaccos(List<DeliveryTobaccoDto> tobaccos) {
        this.tobaccos = tobaccos;
    }
}



