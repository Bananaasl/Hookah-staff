package com.example.hookahstaff.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Конфигурация веб-слоя приложения
 * 
 * <p>Настраивает обработку статических ресурсов и CORS политику
 * для обеспечения корректной работы фронтенда.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Настройка обработчиков статических ресурсов
     * 
     * <p>Настраивает обслуживание статических файлов из папки /static/
     * с отключенным кэшированием для разработки.</p>
     * 
     * @param registry реестр обработчиков ресурсов
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }

    /**
     * Настройка CORS политики
     * 
     * <p>Разрешает кросс-доменные запросы для API endpoints
     * со всех источников для упрощения разработки.</p>
     * 
     * @param registry реестр CORS настроек
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}

