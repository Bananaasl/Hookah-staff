package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.Tobacco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TobaccoRepository extends JpaRepository<Tobacco, Long> {
}