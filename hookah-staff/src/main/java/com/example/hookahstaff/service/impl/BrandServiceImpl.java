package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.entity.Brand;
import com.example.hookahstaff.dto.BrandDto;
import com.example.hookahstaff.mapper.BrandMapper;
import com.example.hookahstaff.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Transactional
    public void saveBrand(BrandDto brand) {
         Brand brandForSave = brandMapper.mapToBrandFromBrandDto(brand);
         saveBrand(brandForSave);
    }

    public Brand getBrand(Long id) {
        return getOptionalBrand(id).get();
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
    }

    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Brand brand) {
        if (!brandRepository.existsById(brand.getId())) {
            throw new RuntimeException("Brand not found with id: " + brand.getId());
        }
        return brandRepository.save(brand);
    }

    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found with id: " + id);
        }
        brandRepository.deleteById(id);
    }

    private void saveBrand(Brand brand){
        brandRepository.save(brand);
    }

    private Optional<Brand> getOptionalBrand(Long id){
        return brandRepository.findById(id);
    }
}
