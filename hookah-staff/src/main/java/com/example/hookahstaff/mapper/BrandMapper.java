package com.example.hookahstaff.mapper;

import com.example.hookahstaff.entity.Brand;
import com.example.hookahstaff.dto.BrandDto;
import com.example.hookahstaff.entity.Taste;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BrandMapper {

    private final TasteMapper tasteMapper;

    public Brand mapToBrandFromBrandDto(BrandDto brandDto) {

        List<Taste> tastes = tasteMapper.mapToTasteFromBrandDto(brandDto);
        Taste taste = tastes.getFirst();
        Brand brand = new Brand(brandDto.name(), brandDto.fortress(), brandDto.price());
        List<Brand> brands = List.of(brand);
        taste.setBrands(brands);
        brand.setTastes(tastes);
        return brand;
    }
}
