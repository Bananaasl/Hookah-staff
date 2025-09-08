package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.entity.Taste;
import com.example.hookahstaff.service.impl.TasteServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.hookahstaff.rest.RestPaths.TASTE_PATH;

@RestController
@RequestMapping(TASTE_PATH)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TasteController {

    private final TasteServiceImpl tasteService;

    @GetMapping
    public ResponseEntity<List<Taste>> getAllTastes() {
        List<Taste> tastes = tasteService.getAllTastes();
        return ResponseEntity.ok(tastes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Taste> getTasteById(@PathVariable Long id) {
        Taste taste = tasteService.getTasteById(id);
        return ResponseEntity.ok(taste);
    }

    @PostMapping
    public ResponseEntity<Taste> createTaste(@RequestBody Taste taste) {
        Taste createdTaste = tasteService.createTaste(taste);
        return ResponseEntity.ok(createdTaste);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Taste> updateTaste(@PathVariable Long id, @RequestBody Taste taste) {
        taste.setId(id);
        Taste updatedTaste = tasteService.updateTaste(taste);
        return ResponseEntity.ok(updatedTaste);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaste(@PathVariable Long id) {
        tasteService.deleteTaste(id);
        return ResponseEntity.ok().build();
    }
}
