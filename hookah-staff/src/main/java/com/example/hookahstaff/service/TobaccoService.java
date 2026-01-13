package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.entity.Tobacco;

import java.util.List;

/**
 * Интерфейс сервиса для работы с табаками
 * 
 * <p>Определяет контракт для операций с табаками, включая массовое создание табаков
 * нескольких брендов с разными вкусами.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
public interface TobaccoService {

    /**
     * Получить текущие табаки (незавершенного привоза)
     * 
     * @return список текущих табаков
     */
    List<Tobacco> getCurrentTobaccos();

    /**
     * Удалить табак по идентификатору
     * 
     * @param id идентификатор табака для удаления
     */
    void deleteTobacco(Long id);

    /**
     * Обновить существующий табак
     * 
     * @param tobacco табак с обновленными данными
     * @return обновленный табак
     */
    Tobacco updateTobacco(Tobacco tobacco);

    /**
     * Массовое создание табаков нескольких брендов с разными вкусами
     * 
     * @param multiBrandDto DTO с данными для массового создания нескольких брендов
     * @return список созданных табаков
     */
    List<Tobacco> createMultiBrandTobaccos(MultiBrandTobaccoDto multiBrandDto);

    /**
     * Получить все табаки, отсортированные по бренду и актуальности
     * 
     * @return список всех табаков, отсортированный по бренду (по алфавиту) и актуальности (по убыванию)
     */
    List<Tobacco> getAllTobaccosSortedByBrandAndRelevance();
}
