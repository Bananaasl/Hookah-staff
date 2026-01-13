package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.Tobacco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы с табаками
 * 
 * <p>Предоставляет стандартные CRUD операции для сущности Tobacco.
 * Наследует все методы от JpaRepository.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Repository
public interface TobaccoRepository extends JpaRepository<Tobacco, Long> {
    
    /**
     * Найти все табаки с указанным брендом и вкусом
     * 
     * @param brandName название бренда
     * @param taste вкус табака
     * @return список табаков с указанным брендом и вкусом
     */
    @Query("SELECT t FROM Tobacco t WHERE t.brand_name = :brandName AND t.taste = :taste")
    List<Tobacco> findByBrandNameAndTaste(String brandName, String taste);
    
    /**
     * Найти уникальный табак по бренду, вкусу и цене
     * 
     * @param brandName название бренда
     * @param taste вкус табака
     * @param price цена
     * @return табак с указанными параметрами или null
     */
    @Query("SELECT t FROM Tobacco t WHERE t.brand_name = :brandName AND t.taste = :taste AND t.price = :price")
    Tobacco findByBrandNameAndTasteAndPrice(String brandName, String taste, java.math.BigDecimal price);
}