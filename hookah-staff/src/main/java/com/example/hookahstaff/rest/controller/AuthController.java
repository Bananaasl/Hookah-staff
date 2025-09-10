package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.dto.LoginRequest;
import com.example.hookahstaff.dto.LoginResponse;
import com.example.hookahstaff.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/init")
    public ResponseEntity<String> initializeUsers() {
        try {
            authService.initializeDefaultUsers();
            return ResponseEntity.ok("Пользователи по умолчанию созданы");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка создания пользователей: " + e.getMessage());
        }
    }
}

