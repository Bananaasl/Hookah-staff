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
    
    @Query("SELECT t FROM Tobacco t WHERE t.delivery.id = :deliveryId")
    List<Tobacco> findByDeliveryId(Long deliveryId);
    
    @Query("SELECT t FROM Tobacco t WHERE t.delivery IS NULL OR t.delivery.isFinalized = false")
    List<Tobacco> findCurrentTobaccos();
}