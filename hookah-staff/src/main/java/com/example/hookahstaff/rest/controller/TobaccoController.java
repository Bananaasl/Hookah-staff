package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.entity.Tobacco;
import com.example.hookahstaff.service.TobaccoService;
import com.example.hookahstaff.dto.BulkTobaccoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.hookahstaff.rest.RestPaths.TOBACCO_PATH;

@RestController
@RequestMapping(TOBACCO_PATH)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TobaccoController {

    private final TobaccoService tobaccoService;

    @GetMapping
    public ResponseEntity<List<Tobacco>> getAllTobaccos() {
        List<Tobacco> tobaccos = tobaccoService.getAllTobaccos();
        return ResponseEntity.ok(tobaccos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tobacco> getTobaccoById(@PathVariable Long id) {
        Tobacco tobacco = tobaccoService.getTobaccoById(id);
        return ResponseEntity.ok(tobacco);
    }

    @PostMapping
    public ResponseEntity<Tobacco> createTobacco(@RequestBody Tobacco tobacco) {
        Tobacco createdTobacco = tobaccoService.createTobacco(tobacco);
        return ResponseEntity.ok(createdTobacco);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tobacco> updateTobacco(@PathVariable Long id, @RequestBody Tobacco tobacco) {
        tobacco.setId(id);
        Tobacco updatedTobacco = tobaccoService.updateTobacco(tobacco);
        return ResponseEntity.ok(updatedTobacco);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTobacco(@PathVariable Long id) {
        tobaccoService.deleteTobacco(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Tobacco>> createBulkTobaccos(@RequestBody BulkTobaccoDto bulkTobaccoDto) {
        List<Tobacco> createdTobaccos = tobaccoService.createBulkTobaccos(bulkTobaccoDto);
        return ResponseEntity.ok(createdTobaccos);
    }
}
