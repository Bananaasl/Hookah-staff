package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}