package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO для бренда с множественными вкусами
 * 
 * <p>Представляет бренд табака с его характеристиками и списком вкусов
 * для массового создания табаков одного бренда с разными вкусами.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrandWithTastesDto {
    
    /**
     * Название бренда табака
     */
    private String brandName;
    
    /**
     * Цена за пачку табака в рублях
     */
    private BigDecimal price;
    
    /**
     * Вес пачки табака в граммах
     */
    private Integer weight;
    
    /**
     * Дата заказа табака
     */
    private LocalDate orderDate;
    
    /**
     * Список вкусов для данного бренда
     */
    private List<String> tastes;
}


