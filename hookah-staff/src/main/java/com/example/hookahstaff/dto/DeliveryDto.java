package com.example.hookahstaff.dto;

import com.example.hookahstaff.entity.Tobacco;

import java.time.LocalDateTime;
import java.util.List;

public class DeliveryDto {
    private Long id;
    private LocalDateTime deliveryDate;
    private String createdBy;
    private Boolean isFinalized;
    private LocalDateTime finalizedAt;
    private List<Tobacco> tobaccos;

    public DeliveryDto() {}

    public DeliveryDto(Long id, LocalDateTime deliveryDate, String createdBy, Boolean isFinalized, LocalDateTime finalizedAt, List<Tobacco> tobaccos) {
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

    public List<Tobacco> getTobaccos() {
        return tobaccos;
    }

    public void setTobaccos(List<Tobacco> tobaccos) {
        this.tobaccos = tobaccos;
    }
}


