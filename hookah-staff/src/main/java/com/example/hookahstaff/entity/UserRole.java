package com.example.hookahstaff.entity;

public enum UserRole {
    HOOKAH_MASTER("Кальянный мастер"),
    SENIOR_HOOKAH_MASTER("Старший кальянный мастер");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

