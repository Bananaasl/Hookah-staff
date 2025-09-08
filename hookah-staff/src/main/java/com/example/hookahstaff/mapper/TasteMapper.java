package com.example.hookahstaff.mapper;

import com.example.hookahstaff.dto.BrandDto;
import com.example.hookahstaff.dto.TasteDto;
import com.example.hookahstaff.entity.Taste;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TasteMapper {

    public List<Taste> mapToTasteFromBrandDto(BrandDto brandDto) {
        TasteDto tastes = brandDto.tastes().getFirst();
        Taste taste = new Taste(tastes.name(), tastes.description());
        return List.of(taste);
    }
}
