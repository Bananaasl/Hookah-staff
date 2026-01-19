package com.example.hookahstaff.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Сервис для определения цены табака по бренду и весу
 * Использует фиксированные цены из прайс-листа
 */
public interface PriceService {
    
    /**
     * Определяет цену табака по бренду и весу
     * 
     * @param brandName название бренда
     * @param weight вес в граммах
     * @return цена или null, если цена не найдена
     */
    BigDecimal getPriceByBrandAndWeight(String brandName, Integer weight);
}
