package com.example.hookahstaff.dto;

import com.example.hookahstaff.entity.UserRole;

public class LoginResponse {
    private String token;
    private String username;
    private UserRole role;
    private String roleDisplayName;

    public LoginResponse() {}

    public LoginResponse(String token, String username, UserRole role) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.roleDisplayName = role.getDisplayName();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
        this.roleDisplayName = role.getDisplayName();
    }

    public String getRoleDisplayName() {
        return roleDisplayName;
    }

    public void setRoleDisplayName(String roleDisplayName) {
        this.roleDisplayName = roleDisplayName;
    }
}


