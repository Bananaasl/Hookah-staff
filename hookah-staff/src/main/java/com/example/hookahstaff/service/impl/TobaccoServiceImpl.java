package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.repository.TobaccoRepository;
import com.example.hookahstaff.dto.BulkTobaccoDto;
import com.example.hookahstaff.service.TobaccoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

/**
 * Сервис для работы с табаками
 * 
 * <p>Предоставляет бизнес-логику для управления табаками,
 * включая CRUD операции и массовое создание табаков с разными вкусами.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Service
@RequiredArgsConstructor
public class TobaccoServiceImpl implements TobaccoService {

    /**
     * Репозиторий для работы с табаками
     */
    private final TobaccoRepository tobaccoRepository;

    /**
     * Получить все табаки
     * 
     * @return список всех табаков
     */
    public List<Tobacco> getAllTobaccos() {
        return tobaccoRepository.findAll();
    }

    /**
     * Получить табак по идентификатору
     * 
     * @param id идентификатор табака
     * @return табак с указанным идентификатором
     * @throws RuntimeException если табак не найден
     */
    public Tobacco getTobaccoById(Long id) {
        return tobaccoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tobacco not found with id: " + id));
    }

    /**
     * Создать новый табак
     * 
     * <p>При создании табака вес инвентаризации автоматически
     * устанавливается равным весу пачки.</p>
     * 
     * @param tobacco табак для создания
     * @return созданный табак
     */
    public Tobacco createTobacco(Tobacco tobacco) {
        // Вес инвентаризации всегда равен весу пачки при создании
        tobacco.setInventoryWeight(tobacco.getWeight());
        return tobaccoRepository.save(tobacco);
    }

    /**
     * Обновить существующий табак
     * 
     * @param tobacco табак с обновленными данными
     * @return обновленный табак
     * @throws RuntimeException если табак не найден
     */
    public Tobacco updateTobacco(Tobacco tobacco) {
        if (!tobaccoRepository.existsById(tobacco.getId())) {
            throw new RuntimeException("Tobacco not found with id: " + tobacco.getId());
        }
        return tobaccoRepository.save(tobacco);
    }

    /**
     * Удалить табак по идентификатору
     * 
     * @param id идентификатор табака для удаления
     * @throws RuntimeException если табак не найден
     */
    public void deleteTobacco(Long id) {
        if (!tobaccoRepository.existsById(id)) {
            throw new RuntimeException("Tobacco not found with id: " + id);
        }
        tobaccoRepository.deleteById(id);
    }

    /**
     * Массовое создание табаков с разными вкусами
     * 
     * <p>Создает несколько табаков с одинаковыми характеристиками
     * (бренд, крепость, цена, вес, даты) но разными вкусами.
     * Вес инвентаризации для каждого табака устанавливается равным весу пачки.</p>
     * 
     * @param bulkTobaccoDto DTO с данными для массового создания
     * @return список созданных табаков
     */
    public List<Tobacco> createBulkTobaccos(BulkTobaccoDto bulkTobaccoDto) {
        List<Tobacco> createdTobaccos = new ArrayList<>();
        
        for (String taste : bulkTobaccoDto.getTastes()) {
            Tobacco tobacco = new Tobacco();
            tobacco.setBrand_name(bulkTobaccoDto.getBrand_name());
            tobacco.setFortress(bulkTobaccoDto.getFortress());
            tobacco.setPrice(bulkTobaccoDto.getPrice());
            tobacco.setWeight(bulkTobaccoDto.getWeight());
            tobacco.setOrderDate(bulkTobaccoDto.getOrderDate());
            tobacco.setInventoryDate(bulkTobaccoDto.getInventoryDate());
            // Вес инвентаризации всегда равен весу пачки при создании
            tobacco.setInventoryWeight(bulkTobaccoDto.getWeight());
            tobacco.setTaste(taste);
            
            createdTobaccos.add(tobaccoRepository.save(tobacco));
        }
        
        return createdTobaccos;
    }
}