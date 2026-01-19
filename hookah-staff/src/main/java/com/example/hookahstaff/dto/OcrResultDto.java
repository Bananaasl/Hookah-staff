package com.example.hookahstaff.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO для результата OCR обработки
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OcrResultDto {
    
    /**
     * Список распознанных табаков в текстовом формате
     * Пример: "CHABACCO - Orange Cream (Апельсин-Сливки) 40г 220₽"
     */
    private List<String> recognizedTobaccos;
    
    /**
     * Сообщение об ошибке (если есть)
     */
    private String error;
}
