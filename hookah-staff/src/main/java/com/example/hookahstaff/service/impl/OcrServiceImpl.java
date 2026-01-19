package com.example.hookahstaff.service.impl;

import com.example.hookahstaff.service.OcrService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

/**
 * Реализация OCR сервиса с использованием Python скрипта и Tesseract OCR
 * 
 * Использует локальный Python скрипт с Tesseract для распознавания текста.
 * Преимущества:
 * - Нет ограничений по размеру файла
 * - Полностью бесплатно
 * - Работает локально, не требует интернета
 */
@Slf4j
@Service
public class OcrServiceImpl implements OcrService {

    @Value("${ocr.python.script.path:ocr_service.py}")
    private String pythonScriptPath;
    
    @Value("${ocr.python.command:python3}")
    private String pythonCommand;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Получает абсолютный путь к Python скрипту
     */
    private String getPythonScriptAbsolutePath() {
        String scriptPath = pythonScriptPath;
        
        // Если путь абсолютный, проверяем существование и возвращаем
        java.io.File scriptFile = new java.io.File(scriptPath);
        if (scriptFile.isAbsolute()) {
            if (scriptFile.exists()) {
                return scriptPath;
            } else {
                log.error("Python script not found at absolute path: {}", scriptPath);
                throw new RuntimeException("Python script not found at: " + scriptPath);
            }
        }
        
        // Ищем относительно различных возможных директорий
        String userDir = System.getProperty("user.dir");
        log.debug("Current working directory: {}", userDir);
        
        // Список возможных путей для поиска
        java.util.List<String> searchPaths = new java.util.ArrayList<>();
        
        // 1. Относительно рабочей директории
        searchPaths.add(userDir);
        
        // 2. Относительно корня проекта (если запускаем из target/classes)
        if (userDir.contains("target")) {
            java.io.File currentDir = new java.io.File(userDir);
            // Идем вверх до корня проекта (из target/classes -> target -> корень проекта)
            java.io.File projectRoot = currentDir.getParentFile();
            if (projectRoot != null && projectRoot.getName().equals("target")) {
                projectRoot = projectRoot.getParentFile(); // Корень проекта
                if (projectRoot != null) {
                    searchPaths.add(projectRoot.getAbsolutePath());
                }
            }
        } else {
            // Если не в target, то userDir уже корень проекта
            searchPaths.add(userDir);
            // Также пробуем, если userDir это родительская директория проекта
            java.io.File parentDir = new java.io.File(userDir).getParentFile();
            if (parentDir != null) {
                java.io.File possibleProject = new java.io.File(parentDir, "hookah-staff");
                if (possibleProject.exists() && possibleProject.isDirectory()) {
                    searchPaths.add(possibleProject.getAbsolutePath());
                }
            }
        }
        
        // 3. Пробуем найти относительно текущего класса (из JAR или классов)
        try {
            String classPath = this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath();
            if (classPath != null && !classPath.isEmpty()) {
                java.io.File classFile = new java.io.File(classPath);
                if (classFile.exists()) {
                    // Если это JAR файл, берем его директорию
                    if (classPath.endsWith(".jar")) {
                        searchPaths.add(classFile.getParent());
                    } else {
                        // Если это директория классов, идем на 3 уровня выше (target/classes -> target -> корень)
                        java.io.File root = classFile.getParentFile();
                        if (root != null && root.getName().equals("classes")) {
                            root = root.getParentFile(); // target
                            if (root != null) {
                                root = root.getParentFile(); // корень проекта
                                if (root != null) {
                                    searchPaths.add(root.getAbsolutePath());
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Could not determine class path: {}", e.getMessage());
        }
        
        // Ищем файл во всех возможных путях
        for (String searchPath : searchPaths) {
            scriptFile = new java.io.File(searchPath, scriptPath);
            if (scriptFile.exists() && scriptFile.isFile()) {
                String absolutePath = scriptFile.getAbsolutePath();
                log.info("Found Python script at: {}", absolutePath);
                return absolutePath;
            }
        }
        
        // Если не найден нигде, выводим ошибку с информацией
        log.error("Python script not found. Searched in:");
        for (String searchPath : searchPaths) {
            log.error("  - {}", new java.io.File(searchPath, scriptPath).getAbsolutePath());
        }
        throw new RuntimeException("Python script not found: " + scriptPath + 
            ". Please check the path in application.properties (ocr.python.script.path)");
    }

    @Override
    public String recognizeText(MultipartFile image) {
        // Для распознавания одного изображения используем упрощенный подход
        // Создаем временный список с одним файлом
        List<MultipartFile> singleImageList = new ArrayList<>();
        singleImageList.add(image);
        
        // Создаем пустую накладную (не используется для одного изображения)
        MultipartFile dummyInvoice = image;
        
        // Используем основной метод, но для одного изображения
        // В реальности для одного изображения можно упростить, но для консистентности используем общий метод
        List<String> results = extractTobaccoInfo(dummyInvoice, singleImageList);
        
        // Возвращаем первый результат или весь текст
        if (!results.isEmpty()) {
            return results.get(0);
        }
        
        return "";
    }

    @Override
    public List<String> extractTobaccoInfo(MultipartFile invoicePhoto, List<MultipartFile> tobaccoPhotos) {
        Path tempInvoiceFile = null;
        List<Path> tempTobaccoFiles = new ArrayList<>();
        
        try {
            // Сохраняем файлы во временную директорию
            // Накладная теперь опциональна
            if (invoicePhoto != null && !invoicePhoto.isEmpty()) {
                tempInvoiceFile = Files.createTempFile("ocr_invoice_", "_" + invoicePhoto.getOriginalFilename());
                Files.copy(invoicePhoto.getInputStream(), tempInvoiceFile, StandardCopyOption.REPLACE_EXISTING);
            }
            
            for (MultipartFile tobaccoPhoto : tobaccoPhotos) {
                Path tempFile = Files.createTempFile("ocr_tobacco_", "_" + tobaccoPhoto.getOriginalFilename());
                Files.copy(tobaccoPhoto.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
                tempTobaccoFiles.add(tempFile);
            }
            
            // Формируем JSON запрос для Python скрипта
            ObjectMapper mapper = new ObjectMapper();
            java.util.Map<String, Object> request = new java.util.HashMap<>();
            if (tempInvoiceFile != null) {
                request.put("invoice_path", tempInvoiceFile.toString());
            } else {
                // Если накладной нет, передаем null
                request.put("invoice_path", null);
            }
            request.put("tobacco_paths", tempTobaccoFiles.stream()
                .map(Path::toString)
                .collect(java.util.stream.Collectors.toList()));
            
            String jsonRequest = mapper.writeValueAsString(request);
            
            // Вызываем Python скрипт
            String scriptAbsolutePath = getPythonScriptAbsolutePath();
            ProcessBuilder processBuilder = new ProcessBuilder(
                pythonCommand,
                scriptAbsolutePath
            );
            
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            // Отправляем JSON в stdin
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream(), "utf-8"))) {
                writer.write(jsonRequest);
                writer.flush();
            }
            
            // Читаем результат
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), "utf-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Python script failed with exit code: {}", exitCode);
                log.error("Output: {}", output.toString());
                throw new RuntimeException("Ошибка OCR: " + output.toString());
            }
            
            // Парсим JSON ответ
            JsonNode jsonResponse = objectMapper.readTree(output.toString());
            
            if (jsonResponse.has("error")) {
                throw new RuntimeException("Ошибка OCR: " + jsonResponse.get("error").asText());
            }
            
            List<String> recognizedTobaccos = new ArrayList<>();
            JsonNode tobaccosNode = jsonResponse.get("recognized_tobaccos");
            if (tobaccosNode != null && tobaccosNode.isArray()) {
                for (JsonNode tobaccoNode : tobaccosNode) {
                    recognizedTobaccos.add(tobaccoNode.asText());
                }
            }
            
            log.info("Распознано табаков: {}", recognizedTobaccos.size());
            return recognizedTobaccos;
            
        } catch (IOException | InterruptedException e) {
            log.error("Error during OCR processing", e);
            throw new RuntimeException("Ошибка при обработке изображений: " + e.getMessage(), e);
        } finally {
            // Удаляем временные файлы
            try {
                if (tempInvoiceFile != null) {
                    Files.deleteIfExists(tempInvoiceFile);
                }
                for (Path tempFile : tempTobaccoFiles) {
                    Files.deleteIfExists(tempFile);
                }
            } catch (IOException e) {
                log.warn("Failed to delete temp files", e);
            }
        }
    }
    
    @Override
    public List<String> parseInvoicePositions(MultipartFile invoicePhoto) {
        Path tempInvoiceFile = null;
        
        try {
            // Сохраняем файл во временную директорию
            tempInvoiceFile = Files.createTempFile("ocr_invoice_", "_" + invoicePhoto.getOriginalFilename());
            Files.copy(invoicePhoto.getInputStream(), tempInvoiceFile, StandardCopyOption.REPLACE_EXISTING);
            
            // Формируем JSON запрос для Python скрипта
            ObjectMapper mapper = new ObjectMapper();
            java.util.Map<String, Object> request = new java.util.HashMap<>();
            request.put("invoice_path", tempInvoiceFile.toString());
            request.put("mode", "parse_invoice"); // Режим парсинга накладной
            
            String jsonRequest = mapper.writeValueAsString(request);
            
            // Вызываем Python скрипт
            String scriptAbsolutePath = getPythonScriptAbsolutePath();
            ProcessBuilder processBuilder = new ProcessBuilder(
                pythonCommand,
                scriptAbsolutePath
            );
            
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            // Отправляем JSON в stdin
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream(), "utf-8"))) {
                writer.write(jsonRequest);
                writer.flush();
            }
            
            // Читаем результат
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), "utf-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Python script failed with exit code: {}", exitCode);
                log.error("Output: {}", output.toString());
                throw new RuntimeException("Ошибка OCR: " + output.toString());
            }
            
            // Парсим JSON ответ
            JsonNode jsonResponse = objectMapper.readTree(output.toString());
            
            if (jsonResponse.has("error")) {
                throw new RuntimeException("Ошибка OCR: " + jsonResponse.get("error").asText());
            }
            
            List<String> positions = new ArrayList<>();
            JsonNode positionsNode = jsonResponse.get("positions");
            if (positionsNode != null && positionsNode.isArray()) {
                for (JsonNode positionNode : positionsNode) {
                    // Формируем строку: "Бренд - Вкус вес количество"
                    String brand = positionNode.has("brand") ? positionNode.get("brand").asText() : "";
                    String taste = positionNode.has("taste") ? positionNode.get("taste").asText() : "";
                    Integer weight = positionNode.has("weight") ? positionNode.get("weight").asInt() : null;
                    Integer quantity = positionNode.has("quantity") ? positionNode.get("quantity").asInt() : null;
                    
                    StringBuilder positionStr = new StringBuilder();
                    if (!brand.isEmpty()) positionStr.append(brand);
                    if (!taste.isEmpty()) {
                        if (positionStr.length() > 0) positionStr.append(" - ");
                        positionStr.append(taste);
                    }
                    if (weight != null) positionStr.append(" ").append(weight).append("г");
                    if (quantity != null) positionStr.append(" ").append(quantity).append("шт");
                    
                    positions.add(positionStr.toString());
                }
            }
            
            log.info("Распознано позиций из накладной: {}", positions.size());
            return positions;
            
        } catch (IOException | InterruptedException e) {
            log.error("Error during invoice parsing", e);
            throw new RuntimeException("Ошибка при обработке накладной: " + e.getMessage(), e);
        } finally {
            // Удаляем временный файл
            try {
                if (tempInvoiceFile != null) {
                    Files.deleteIfExists(tempInvoiceFile);
                }
            } catch (IOException e) {
                log.warn("Failed to delete temp file", e);
            }
        }
    }
    
}
