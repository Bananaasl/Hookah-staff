package com.example.hookahstaff.service;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.repository.TobaccoRepository;
import com.example.hookahstaff.dto.BulkTobaccoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class TobaccoService {

    private final TobaccoRepository tobaccoRepository;

    public List<Tobacco> getAllTobaccos() {
        return tobaccoRepository.findAll();
    }

    public Tobacco getTobaccoById(Long id) {
        return tobaccoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tobacco not found with id: " + id));
    }

    public Tobacco createTobacco(Tobacco tobacco) {
        // Вес инвентаризации всегда равен весу пачки при создании
        tobacco.setInventoryWeight(tobacco.getWeight());
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

    public List<Tobacco> createBulkTobaccos(BulkTobaccoDto bulkTobaccoDto) {
        List<Tobacco> createdTobaccos = new ArrayList<>();
        
        for (String taste : bulkTobaccoDto.getTastes()) {
            Tobacco tobacco = new Tobacco();
            tobacco.setBrand_name(bulkTobaccoDto.getBrand_name());
            tobacco.setFortress(bulkTobaccoDto.getFortress());
            tobacco.setPrice(bulkTobaccoDto.getPrice());
            tobacco.setWeight(bulkTobaccoDto.getWeight());
            tobacco.setOrderDate(bulkTobaccoDto.getOrderDate());
            tobacco.setInventoryDate(bulkTobaccoDto.getInventoryDate());
            // Вес инвентаризации всегда равен весу пачки при создании
            tobacco.setInventoryWeight(bulkTobaccoDto.getWeight());
            tobacco.setTaste(taste);
            
            createdTobaccos.add(tobaccoRepository.save(tobacco));
        }
        
        return createdTobaccos;
    }
}