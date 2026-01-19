package com.example.hookahstaff.rest.controller;

import com.example.hookahstaff.dto.DeliveryDto;
import com.example.hookahstaff.dto.MultiBrandTobaccoDto;
import com.example.hookahstaff.dto.OcrResultDto;
import com.example.hookahstaff.entity.Delivery;
import com.example.hookahstaff.service.DeliveryService;
import com.example.hookahstaff.service.OcrService;
import com.example.hookahstaff.service.TobaccoParserService;
import com.example.hookahstaff.service.TobaccoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;
    
    @Autowired
    private OcrService ocrService;
    
    @Autowired
    private TobaccoParserService tobaccoParserService;
    
    @Autowired
    private TobaccoService tobaccoService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentDelivery() {
        Optional<Delivery> delivery = deliveryService.getCurrentDelivery();
        if (delivery.isPresent()) {
            return ResponseEntity.ok(deliveryService.convertToDto(delivery.get()));
        } else {
            return ResponseEntity.ok(null);
        }
    }

    @GetMapping("/finalized")
    public ResponseEntity<List<DeliveryDto>> getFinalizedDeliveries() {
        List<Delivery> deliveries = deliveryService.getFinalizedDeliveries();
        List<DeliveryDto> deliveryDtos = deliveries.stream()
                .map(deliveryService::convertToDto)
                .toList();
        return ResponseEntity.ok(deliveryDtos);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewDelivery(@RequestParam String createdBy) {
        try {
            Delivery delivery = deliveryService.createNewDelivery(createdBy);
            return ResponseEntity.ok(deliveryService.convertToDto(delivery));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{deliveryId}/finalize")
    public ResponseEntity<?> finalizeDelivery(@PathVariable Long deliveryId, @RequestParam String finalizedBy) {
        try {
            Delivery delivery = deliveryService.finalizeDelivery(deliveryId, finalizedBy);
            return ResponseEntity.ok(deliveryService.convertToDto(delivery));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{deliveryId}/tobaccos")
    public ResponseEntity<List<com.example.hookahstaff.dto.DeliveryTobaccoDto>> getTobaccosByDelivery(@PathVariable Long deliveryId) {
        List<com.example.hookahstaff.dto.DeliveryTobaccoDto> tobaccos = deliveryService.getTobaccosByDelivery(deliveryId);
        return ResponseEntity.ok(tobaccos);
    }

    @DeleteMapping("/{deliveryId}/cancel")
    public ResponseEntity<?> cancelDelivery(@PathVariable Long deliveryId) {
        try {
            deliveryService.cancelDelivery(deliveryId);
            return ResponseEntity.ok("Привоз успешно отменен");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{deliveryId}/cost")
    public ResponseEntity<Double> getDeliveryCost(@PathVariable Long deliveryId) {
        Double cost = deliveryService.calculateDeliveryCost(deliveryId);
        return ResponseEntity.ok(cost);
    }

    /**
     * Парсит накладную и извлекает позиции табаков
     * В накладной должны быть указаны: бренд, вкус, вес и количество пачек для каждой позиции
     * 
     * @param invoicePhoto фото накладной
     * @return список распознанных позиций в текстовом формате "Бренд - Вкус вес количество"
     */
    @PostMapping("/ocr/parse-invoice")
    public ResponseEntity<OcrResultDto> parseInvoice(
            @RequestParam("invoicePhoto") MultipartFile invoicePhoto) {
        try {
            if (invoicePhoto == null || invoicePhoto.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new OcrResultDto(null, "Не загружено фото накладной"));
            }
            
            List<String> positions = ocrService.parseInvoicePositions(invoicePhoto);
            
            OcrResultDto result = new OcrResultDto(positions, null);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new OcrResultDto(null, "Ошибка при обработке накладной: " + e.getMessage()));
        }
    }

    /**
     * Обрабатывает фото накладной и пачек табака через OCR
     * Распознает текст и извлекает информацию о табаках
     * 
     * @param deliveryId ID привоза (опционально, если не указан - используется текущий привоз)
     * @param invoicePhoto фото накладной с ценами
     * @param tobaccoPhotos массив фото пачек табака
     * @return список распознанных табаков в текстовом формате
     */
    @PostMapping("/ocr/recognize")
    public ResponseEntity<OcrResultDto> recognizeTobaccos(
            @RequestParam(required = false) Long deliveryId,
            @RequestParam(value = "invoicePhoto", required = false) MultipartFile invoicePhoto,
            @RequestParam("tobaccoPhotos") MultipartFile[] tobaccoPhotos) {
        try {
            List<MultipartFile> tobaccoPhotosList = new ArrayList<>();
            for (MultipartFile photo : tobaccoPhotos) {
                if (photo != null && !photo.isEmpty()) {
                    tobaccoPhotosList.add(photo);
                }
            }
            
            if (tobaccoPhotosList.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new OcrResultDto(null, "Не загружено ни одного фото пачек табака"));
            }
            
            // Накладная теперь опциональна - если не загружена, создаем пустой файл
            MultipartFile finalInvoicePhoto = invoicePhoto;
            if (finalInvoicePhoto == null || finalInvoicePhoto.isEmpty()) {
                // Создаем пустой файл-заглушку (не будет использоваться для извлечения цен)
                finalInvoicePhoto = null;
            }
            
            List<String> recognizedTobaccos = ocrService.extractTobaccoInfo(finalInvoicePhoto, tobaccoPhotosList);
            
            OcrResultDto result = new OcrResultDto(recognizedTobaccos, null);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new OcrResultDto(null, "Ошибка при обработке фото: " + e.getMessage()));
        }
    }

    /**
     * Обрабатывает фото через OCR и автоматически добавляет распознанные табаки в привоз
     * 
     * @param deliveryId ID привоза (опционально, если не указан - создается новый или используется текущий)
     * @param createdBy имя пользователя, создающего привоз
     * @param invoicePhoto фото накладной с ценами
     * @param tobaccoPhotos массив фото пачек табака
     * @return информация о созданном/обновленном привозе
     */
    @PostMapping("/ocr/add-tobaccos")
    public ResponseEntity<?> addTobaccosFromOcr(
            @RequestParam(required = false) Long deliveryId,
            @RequestParam String createdBy,
            @RequestParam("invoicePhoto") MultipartFile invoicePhoto,
            @RequestParam("tobaccoPhotos") MultipartFile[] tobaccoPhotos) {
        try {
            // Получаем или создаем привоз
            Delivery delivery;
            if (deliveryId != null) {
                Optional<Delivery> existingDelivery = deliveryService.getCurrentDelivery();
                if (existingDelivery.isPresent() && existingDelivery.get().getId().equals(deliveryId)) {
                    delivery = existingDelivery.get();
                } else {
                    return ResponseEntity.badRequest().body("Привоз с указанным ID не найден или уже завершен");
                }
            } else {
                Optional<Delivery> currentDelivery = deliveryService.getCurrentDelivery();
                if (currentDelivery.isPresent()) {
                    delivery = currentDelivery.get();
                } else {
                    delivery = deliveryService.createNewDelivery(createdBy);
                }
            }
            
            // Обрабатываем фото через OCR
            List<MultipartFile> tobaccoPhotosList = new ArrayList<>();
            for (MultipartFile photo : tobaccoPhotos) {
                if (photo != null && !photo.isEmpty()) {
                    tobaccoPhotosList.add(photo);
                }
            }
            
            if (tobaccoPhotosList.isEmpty()) {
                return ResponseEntity.badRequest().body("Не загружено ни одного фото пачек табака");
            }
            
            List<String> recognizedTobaccos = ocrService.extractTobaccoInfo(invoicePhoto, tobaccoPhotosList);
            
            if (recognizedTobaccos.isEmpty()) {
                return ResponseEntity.badRequest().body("Не удалось распознать табаки на фото");
            }
            
            // Парсим распознанные табаки
            MultiBrandTobaccoDto multiBrandDto = tobaccoParserService.parseTobaccos(recognizedTobaccos, delivery.getId());
            
            // Добавляем табаки в привоз
            tobaccoService.createMultiBrandTobaccos(multiBrandDto);
            
            // Возвращаем обновленный привоз
            return ResponseEntity.ok(deliveryService.convertToDto(delivery));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при обработке: " + e.getMessage());
        }
    }
}


