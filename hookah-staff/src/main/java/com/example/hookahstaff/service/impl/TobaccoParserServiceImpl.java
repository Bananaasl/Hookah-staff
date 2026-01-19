package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.dto.BrandWithTastesDto;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.service.TobaccoParserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Реализация парсера текстовой информации о табаках
 */
@Slf4j
@Service
public class TobaccoParserServiceImpl implements TobaccoParserService {

    @Override
    public MultiBrandTobaccoDto parseTobaccos(List<String> recognizedTobaccos, Long deliveryId) {
        MultiBrandTobaccoDto dto = new MultiBrandTobaccoDto();
        dto.setDeliveryId(deliveryId);
        
        // Группируем табаки по бренду, цене и весу
        Map<String, List<ParsedTobacco>> groupedByBrandAndPrice = new HashMap<>();
        
        for (String tobaccoStr : recognizedTobaccos) {
            ParsedTobacco parsed = parseTobaccoString(tobaccoStr);
            if (parsed != null && parsed.isValid()) {
                // Создаем ключ для группировки: бренд_цена_вес
                String key = String.format("%s_%s_%s", 
                    parsed.brand != null ? parsed.brand : "",
                    parsed.price != null ? parsed.price.toString() : "",
                    parsed.weight != null ? parsed.weight.toString() : "");
                
                groupedByBrandAndPrice.computeIfAbsent(key, k -> new ArrayList<>()).add(parsed);
            }
        }
        
        // Преобразуем в BrandWithTastesDto
        List<BrandWithTastesDto> brands = new ArrayList<>();
        
        for (Map.Entry<String, List<ParsedTobacco>> entry : groupedByBrandAndPrice.entrySet()) {
            List<ParsedTobacco> tobaccos = entry.getValue();
            if (!tobaccos.isEmpty()) {
                ParsedTobacco first = tobaccos.get(0);
                
                BrandWithTastesDto brandDto = new BrandWithTastesDto();
                brandDto.setBrandName(first.brand != null ? first.brand : "");
                brandDto.setPrice(first.price != null ? first.price : BigDecimal.ZERO);
                brandDto.setWeight(first.weight);
                brandDto.setOrderDate(LocalDate.now());
                
                // Собираем все вкусы для этого бренда/цены/веса
                List<String> tastes = tobaccos.stream()
                    .map(t -> t.taste != null ? t.taste : "")
                    .filter(taste -> !taste.isEmpty())
                    .collect(Collectors.toList());
                
                brandDto.setTastes(tastes);
                brands.add(brandDto);
            }
        }
        
        dto.setBrands(brands);
        return dto;
    }
    
    /**
     * Парсит строку с информацией о табаке
     * Формат: "БРЕНД - Вкус (Перевод) вес цена₽"
     * Пример: "CHABACCO - Orange Cream (Апельсин-Сливки) 40г 220₽"
     */
    private ParsedTobacco parseTobaccoString(String tobaccoStr) {
        ParsedTobacco parsed = new ParsedTobacco();
        String text = tobaccoStr.trim();
        
        // Извлекаем цену
        Pattern pricePattern = Pattern.compile("(\\d+(?:[.,]\\d+)?)\\s*₽");
        Matcher priceMatcher = pricePattern.matcher(text);
        if (priceMatcher.find()) {
            try {
                String priceStr = priceMatcher.group(1).replace(",", ".");
                parsed.price = new BigDecimal(priceStr);
            } catch (NumberFormatException e) {
                log.warn("Не удалось распознать цену в строке: {}", tobaccoStr);
            }
        }
        
        // Извлекаем вес
        Pattern weightPattern = Pattern.compile("(\\d+)\\s*(?:г|гр|g|grams?)", Pattern.CASE_INSENSITIVE);
        Matcher weightMatcher = weightPattern.matcher(text);
        if (weightMatcher.find()) {
            try {
                parsed.weight = Integer.parseInt(weightMatcher.group(1));
            } catch (NumberFormatException e) {
                log.warn("Не удалось распознать вес в строке: {}", tobaccoStr);
            }
        }
        
        // Извлекаем бренд (до первого " - ")
        int dashIndex = text.indexOf(" - ");
        if (dashIndex > 0) {
            parsed.brand = text.substring(0, dashIndex).trim();
            
            // Извлекаем вкус (после " - ")
            String afterDash = text.substring(dashIndex + 3).trim();
            
            // Убираем цену и вес из строки вкуса
            afterDash = pricePattern.matcher(afterDash).replaceAll("");
            afterDash = weightPattern.matcher(afterDash).replaceAll("").trim();
            
            // Убираем вес из конца строки, если остался
            afterDash = afterDash.replaceAll("\\s*\\d+\\s*(?:г|гр|g)\\s*$", "").trim();
            
            parsed.taste = afterDash;
        } else {
            // Если нет разделителя " - ", пробуем найти бренд в начале
            // Бренд обычно в верхнем регистре
            String[] parts = text.split("\\s+");
            if (parts.length > 0) {
                String firstPart = parts[0];
                // Проверяем, является ли первая часть брендом (обычно короткое слово в верхнем регистре)
                if (firstPart.length() < 20 && firstPart.equals(firstPart.toUpperCase())) {
                    parsed.brand = firstPart;
                    
                    // Остальное - вкус
                    String rest = text.substring(firstPart.length()).trim();
                    rest = pricePattern.matcher(rest).replaceAll("");
                    rest = weightPattern.matcher(rest).replaceAll("").trim();
                    rest = rest.replaceAll("\\s*\\d+\\s*(?:г|гр|g)\\s*$", "").trim();
                    parsed.taste = rest;
                } else {
                    // Если не похоже на бренд, считаем всё вкусом
                    String rest = text;
                    rest = pricePattern.matcher(rest).replaceAll("");
                    rest = weightPattern.matcher(rest).replaceAll("").trim();
                    rest = rest.replaceAll("\\s*\\d+\\s*(?:г|гр|g)\\s*$", "").trim();
                    parsed.taste = rest;
                }
            }
        }
        
        return parsed;
    }
    
    /**
     * Внутренний класс для хранения распарсенной информации о табаке
     */
    private static class ParsedTobacco {
        String brand;
        String taste;
        BigDecimal price;
        Integer weight;
        
        boolean isValid() {
            return (brand != null && !brand.isEmpty()) || (taste != null && !taste.isEmpty());
        }
    }
}
