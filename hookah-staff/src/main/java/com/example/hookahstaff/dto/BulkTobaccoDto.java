package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BulkTobaccoDto {
    private String brand_name;
    private Integer fortress;
    private BigDecimal price;
    private Integer weight;
    private LocalDate orderDate;
    private LocalDate inventoryDate;
    private Integer inventoryWeight;
    private List<String> tastes; // Список вкусов для массового добавления
}
