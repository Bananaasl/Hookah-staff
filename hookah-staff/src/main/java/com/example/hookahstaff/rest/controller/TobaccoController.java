package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.service.TobaccoService;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.hookahstaff.rest.RestPaths.TOBACCO_PATH;

/**
 * REST контроллер для работы с табаками
 * 
 * <p>Предоставляет HTTP API для управления табаками в кальянной.
 * Поддерживает массовое создание табаков нескольких брендов с разными вкусами,
 * получение текущих табаков, оценку полки, обновление и удаление табаков.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@RestController
@RequestMapping(TOBACCO_PATH)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TobaccoController {

    /**
     * Сервис для работы с табаками
     */
    private final TobaccoService tobaccoService;

    /**
     * Получить текущие табаки (незавершенного привоза)
     * 
     * @return список текущих табаков
     */
    @GetMapping("/current")
    public ResponseEntity<List<Tobacco>> getCurrentTobaccos() {
        List<Tobacco> tobaccos = tobaccoService.getCurrentTobaccos();
        return ResponseEntity.ok(tobaccos);
    }

    /**
     * Получить все табаки для оценки полки (отсортированные по бренду и актуальности)
     * 
     * @return список всех табаков, отсортированный по бренду и актуальности (по убыванию)
     */
    @GetMapping("/shelf-rating")
    public ResponseEntity<List<Tobacco>> getShelfRating() {
        List<Tobacco> tobaccos = tobaccoService.getAllTobaccosSortedByBrandAndRelevance();
        return ResponseEntity.ok(tobaccos);
    }

    /**
     * Обновить существующий табак (используется для обновления веса инвентаризации)
     * 
     * @param id идентификатор табака для обновления
     * @param tobacco обновленные данные табака
     * @return обновленный табак
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tobacco> updateTobacco(@PathVariable Long id, @RequestBody Tobacco tobacco) {
        tobacco.setId(id);
        Tobacco updatedTobacco = tobaccoService.updateTobacco(tobacco);
        return ResponseEntity.ok(updatedTobacco);
    }

    /**
     * Удалить табак по идентификатору
     * 
     * @param id идентификатор табака для удаления
     * @return пустой ответ с кодом 200
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTobacco(@PathVariable Long id) {
        tobaccoService.deleteTobacco(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Массовое создание табаков нескольких брендов с разными вкусами
     * 
     * @param multiBrandDto DTO с данными для массового создания нескольких брендов
     * @return список созданных табаков
     */
    @PostMapping("/multi-brand")
    public ResponseEntity<List<Tobacco>> createMultiBrandTobaccos(@RequestBody MultiBrandTobaccoDto multiBrandDto) {
        List<Tobacco> createdTobaccos = tobaccoService.createMultiBrandTobaccos(multiBrandDto);
        return ResponseEntity.ok(createdTobaccos);
    }
}
