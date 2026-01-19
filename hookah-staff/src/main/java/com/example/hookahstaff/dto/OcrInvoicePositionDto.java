package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для позиции из накладной
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OcrInvoicePositionDto {
    
    /**
     * Название бренда
     */
    private String brandName;
    
    /**
     * Вкус табака
     */
    private String taste;
    
    /**
     * Вес в граммах
     */
    private Integer weight;
    
    /**
     * Количество пачек
     */
    private Integer quantity;
}
