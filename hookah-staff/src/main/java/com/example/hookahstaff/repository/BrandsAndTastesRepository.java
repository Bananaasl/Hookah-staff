package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.BrandsAndTastes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandsAndTastesRepository extends JpaRepository<BrandsAndTastes, Long> {
}