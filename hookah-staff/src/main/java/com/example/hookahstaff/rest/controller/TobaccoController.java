package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.service.TobaccoService;
import com.example.hookahstaff.dto.BulkTobaccoDto;
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
 * Поддерживает CRUD операции и массовое создание табаков с разными вкусами.</p>
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
     * Получить все табаки
     * 
     * @return список всех табаков
     */
    @GetMapping
    public ResponseEntity<List<Tobacco>> getAllTobaccos() {
        List<Tobacco> tobaccos = tobaccoService.getAllTobaccos();
        return ResponseEntity.ok(tobaccos);
    }

    /**
     * Получить табак по идентификатору
     * 
     * @param id идентификатор табака
     * @return табак с указанным идентификатором
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tobacco> getTobaccoById(@PathVariable Long id) {
        Tobacco tobacco = tobaccoService.getTobaccoById(id);
        return ResponseEntity.ok(tobacco);
    }

    /**
     * Создать новый табак
     * 
     * @param tobacco данные табака для создания
     * @return созданный табак
     */
    @PostMapping
    public ResponseEntity<Tobacco> createTobacco(@RequestBody Tobacco tobacco) {
        Tobacco createdTobacco = tobaccoService.createTobacco(tobacco);
        return ResponseEntity.ok(createdTobacco);
    }

    /**
     * Обновить существующий табак
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
     * Массовое создание табаков одного бренда с разными вкусами
     * 
     * @param bulkTobaccoDto DTO с данными для массового создания
     * @return список созданных табаков
     */
    @PostMapping("/bulk")
    public ResponseEntity<List<Tobacco>> createBulkTobaccos(@RequestBody BulkTobaccoDto bulkTobaccoDto) {
        List<Tobacco> createdTobaccos = tobaccoService.createBulkTobaccos(bulkTobaccoDto);
        return ResponseEntity.ok(createdTobaccos);
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
