package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.TobaccoAndTaste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TobaccoAndTasteRepository extends JpaRepository<TobaccoAndTaste, Long> {
}