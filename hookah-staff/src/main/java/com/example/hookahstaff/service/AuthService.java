package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.LoginRequest;
import com.example.hookahstaff.dto.LoginResponse;
import com.example.hookahstaff.entity.User;
import com.example.hookahstaff.entity.UserRole;
import com.example.hookahstaff.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Простая проверка пароля (в реальном приложении нужно использовать BCrypt)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Пользователь заблокирован");
        }

        // Генерируем простой токен (в реальном приложении нужно использовать JWT)
        String token = UUID.randomUUID().toString();

        return new LoginResponse(token, user.getUsername(), user.getRole());
    }

    public void initializeDefaultUsers() {
        // Создаем пользователей по умолчанию, если их нет
        if (!userRepository.existsByUsername("master")) {
            User master = new User("master", "master123", UserRole.HOOKAH_MASTER);
            userRepository.save(master);
        }

        if (!userRepository.existsByUsername("senior")) {
            User senior = new User("senior", "senior123", UserRole.SENIOR_HOOKAH_MASTER);
            userRepository.save(senior);
        }
    }
}


