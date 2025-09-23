package com.example.hookahstaff.entity;

public enum UserRole {
    HOOKAH_MASTER("Кальянный мастер");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}



