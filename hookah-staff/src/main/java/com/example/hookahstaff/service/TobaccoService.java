package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.BulkTobaccoDto;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.entity.Tobacco;

import java.util.List;

/**
 * Интерфейс сервиса для работы с табаками
 * 
 * <p>Определяет контракт для операций с табаками, включая CRUD операции,
 * массовое создание табаков одного бренда и массовое создание табаков
 * нескольких брендов с разными вкусами.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
public interface TobaccoService {

    /**
     * Получить все табаки
     * 
     * @return список всех табаков
     */
    List<Tobacco> getAllTobaccos();

    /**
     * Получить текущие табаки (незавершенного привоза)
     * 
     * @return список текущих табаков
     */
    List<Tobacco> getCurrentTobaccos();

    /**
     * Получить табак по идентификатору
     * 
     * @param id идентификатор табака
     * @return табак с указанным идентификатором
     */
    Tobacco getTobaccoById(Long id);

    /**
     * Создать новый табак
     * 
     * @param tobacco табак для создания
     * @return созданный табак
     */
    Tobacco createTobacco(Tobacco tobacco);

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
     * Массовое создание табаков одного бренда с разными вкусами
     * 
     * @param bulkTobaccoDto DTO с данными для массового создания
     * @return список созданных табаков
     */
    List<Tobacco> createBulkTobaccos(BulkTobaccoDto bulkTobaccoDto);

    /**
     * Массовое создание табаков нескольких брендов с разными вкусами
     * 
     * @param multiBrandDto DTO с данными для массового создания нескольких брендов
     * @return список созданных табаков
     */
    List<Tobacco> createMultiBrandTobaccos(MultiBrandTobaccoDto multiBrandDto);
}
