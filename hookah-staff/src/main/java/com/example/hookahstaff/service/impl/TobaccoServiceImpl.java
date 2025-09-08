package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.repository.TobaccoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TobaccoServiceImpl {

    private final TobaccoRepository tobaccoRepository;

    public List<Tobacco> getAllTobaccos() {
        return tobaccoRepository.findAll();
    }

    public Tobacco getTobaccoById(Long id) {
        return tobaccoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tobacco not found with id: " + id));
    }

    public Tobacco createTobacco(Tobacco tobacco) {
        return tobaccoRepository.save(tobacco);
    }

    public Tobacco updateTobacco(Tobacco tobacco) {
        if (!tobaccoRepository.existsById(tobacco.getId())) {
            throw new RuntimeException("Tobacco not found with id: " + tobacco.getId());
        }
        return tobaccoRepository.save(tobacco);
    }

    public void deleteTobacco(Long id) {
        if (!tobaccoRepository.existsById(id)) {
            throw new RuntimeException("Tobacco not found with id: " + id);
        }
        tobaccoRepository.deleteById(id);
    }
}
