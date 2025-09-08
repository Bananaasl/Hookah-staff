package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.Tobacco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}