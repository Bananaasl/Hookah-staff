package com.example.hookahstaff;

import com.example.hookahstaff.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
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
public class HookahStaffApplication implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    /**
     * Точка входа в приложение
     * 
     * @param args аргументы командной строки
     */
    public static void main(String[] args) {
        SpringApplication.run(HookahStaffApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Инициализируем пользователей по умолчанию
        authService.initializeDefaultUsers();
    }
}
