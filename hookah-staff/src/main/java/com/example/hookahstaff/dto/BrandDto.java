package com.example.hookahstaff.dto;

import com.example.hookahstaff.entity.Brand;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for {@link Brand}
 */
public record BrandDto(
        String name,
        Integer fortress,
        BigDecimal price,
        List<TasteDto> tastes
) {
}