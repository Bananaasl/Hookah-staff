package com.example.hookahstaff.dto;

import com.example.hookahstaff.entity.Tobacco;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO для табака в привозе
 * Включает информацию о табаке и вес пачки из DeliveryTobacco
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryTobaccoDto {
    private Long id;
    private String brand_name;
    private String taste;
    private BigDecimal price;
    private Integer weight; // Вес из DeliveryTobacco
    private LocalDate orderDate;
    private Boolean isPrimaryAddition;
    private BigDecimal relevanceScore;

    public static DeliveryTobaccoDto fromTobaccoAndWeight(Tobacco tobacco, Integer weight) {
        DeliveryTobaccoDto dto = new DeliveryTobaccoDto();
        dto.setId(tobacco.getId());
        dto.setBrand_name(tobacco.getBrand_name());
        dto.setTaste(tobacco.getTaste());
        dto.setPrice(tobacco.getPrice());
        dto.setWeight(weight); // Вес из DeliveryTobacco
        dto.setOrderDate(tobacco.getOrderDate());
        dto.setIsPrimaryAddition(tobacco.getIsPrimaryAddition());
        dto.setRelevanceScore(tobacco.getRelevanceScore());
        return dto;
    }
}
