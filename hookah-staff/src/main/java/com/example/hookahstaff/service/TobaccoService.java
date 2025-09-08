package com.example.hookahstaff.service;

import com.example.hookahstaff.dto.BulkTobaccoDto;
import com.example.hookahstaff.entity.Tobacco;

import java.util.List;

public interface TobaccoService {

    List<Tobacco> getAllTobaccos();

    Tobacco getTobaccoById(Long id);

    Tobacco createTobacco(Tobacco tobacco);

    void deleteTobacco(Long id);

    Tobacco updateTobacco(Tobacco tobacco);

    List<Tobacco> createBulkTobaccos(BulkTobaccoDto bulkTobaccoDto);
}
