package com.example.hookahstaff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Конфигурация безопасности приложения
 * 
 * <p>Настраивает Spring Security для разрешения доступа ко всем ресурсам
 * без аутентификации, отключает CSRF защиту для упрощения разработки.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Настройка цепочки фильтров безопасности
     * 
     * <p>Отключает CSRF защиту и разрешает доступ ко всем ресурсам
     * без аутентификации для упрощения разработки.</p>
     * 
     * @param http объект HttpSecurity для настройки
     * @return настроенная цепочка фильтров безопасности
     * @throws Exception в случае ошибки конфигурации
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable());
        
        return http.build();
    }
}
