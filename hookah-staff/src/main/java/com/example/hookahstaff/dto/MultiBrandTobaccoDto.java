package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO для массового добавления табаков с множественными брендами
 * 
 * <p>Используется для создания табаков нескольких брендов одновременно,
 * где каждый бренд может иметь свои характеристики и список вкусов.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MultiBrandTobaccoDto {
    
    /**
     * Список брендов с их вкусами для массового создания
     */
    private List<BrandWithTastesDto> brands;
}

