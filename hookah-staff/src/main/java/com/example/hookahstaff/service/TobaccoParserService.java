package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.MultiBrandTobaccoDto;

import java.util.List;

/**
 * Сервис для парсинга текстовой информации о табаках из OCR результата
 */
public interface TobaccoParserService {
    
    /**
     * Парсит список строк с информацией о табаках и преобразует в MultiBrandTobaccoDto
     * 
     * @param recognizedTobaccos список строк в формате "Бренд - Вкус (перевод) вес цена₽"
     * @param deliveryId ID привоза для привязки табаков
     * @return DTO для массового добавления табаков
     */
    MultiBrandTobaccoDto parseTobaccos(List<String> recognizedTobaccos, Long deliveryId);
}
