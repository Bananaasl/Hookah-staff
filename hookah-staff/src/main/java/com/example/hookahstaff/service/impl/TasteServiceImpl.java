package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Taste;
import com.example.hookahstaff.repository.TasteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TasteServiceImpl {

    private final TasteRepository tasteRepository;

    public List<Taste> getAllTastes() {
        return tasteRepository.findAll();
    }

    public Taste getTasteById(Long id) {
        return tasteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taste not found with id: " + id));
    }

    public Taste createTaste(Taste taste) {
        return tasteRepository.save(taste);
    }

    public Taste updateTaste(Taste taste) {
        if (!tasteRepository.existsById(taste.getId())) {
            throw new RuntimeException("Taste not found with id: " + taste.getId());
        }
        return tasteRepository.save(taste);
    }

    public void deleteTaste(Long id) {
        if (!tasteRepository.existsById(id)) {
            throw new RuntimeException("Taste not found with id: " + id);
        }
        tasteRepository.deleteById(id);
    }
}
