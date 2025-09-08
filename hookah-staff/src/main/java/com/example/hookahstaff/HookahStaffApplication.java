package com.example.hookahstaff;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Главный класс приложения Hookah Staff
 * 
 * <p>Приложение для управления табаками в кальянной.
 * Предоставляет REST API для работы с каталогом табаков,
 * включая массовое добавление табаков с разными вкусами.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@SpringBootApplication
public class HookahStaffApplication {

    /**
     * Точка входа в приложение
     * 
     * @param args аргументы командной строки
     */
    public static void main(String[] args) {
        SpringApplication.run(HookahStaffApplication.class, args);
    }
}
