package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO для массового добавления табаков
 * 
 * <p>Используется для создания нескольких табаков с одинаковыми характеристиками
 * но разными вкусами за один запрос.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BulkTobaccoDto {
    
    /**
     * Название бренда табака
     */
    private String brand_name;
    
    /**
     * Крепость табака от 1 до 5
     */
    private Integer fortress;
    
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
     * Дата инвентаризации
     */
    private LocalDate inventoryDate;
    
    /**
     * Вес на момент инвентаризации в граммах
     * (не используется - сервер устанавливает равным weight)
     */
    private Integer inventoryWeight;
    
    /**
     * Список вкусов для массового добавления
     */
    private List<String> tastes;
}
