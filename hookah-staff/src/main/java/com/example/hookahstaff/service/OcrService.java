package com.example.hookahstaff.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Сервис для работы с OCR (Optical Character Recognition)
 * Распознает текст с фотографий накладных и пачек табака
 */
public interface OcrService {
    
    /**
     * Распознает текст с изображения
     * 
     * @param image файл изображения для распознавания
     * @return распознанный текст
     */
    String recognizeText(MultipartFile image);
    
    /**
     * Обрабатывает фото накладной и пачек табака, извлекает информацию о табаках
     * 
     * @param invoicePhoto фото накладной с ценами
     * @param tobaccoPhotos список фото пачек табака
     * @return список распознанных табаков в формате "Бренд - Вкус (перевод) вес цена"
     */
    List<String> extractTobaccoInfo(MultipartFile invoicePhoto, List<MultipartFile> tobaccoPhotos);
    
    /**
     * Обрабатывает фото накладной, извлекает позиции табаков с количеством
     * В накладной должны быть указаны: бренд, вкус, вес и количество пачек для каждой позиции
     * 
     * @param invoicePhoto фото накладной
     * @return список распознанных позиций в формате "Бренд - Вкус вес количество"
     */
    List<String> parseInvoicePositions(MultipartFile invoicePhoto);
}
