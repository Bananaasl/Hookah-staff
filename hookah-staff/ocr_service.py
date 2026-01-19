#!/usr/bin/env python3
"""
OCR Service для распознавания текста с изображений
Использует Tesseract OCR для распознавания текста с фото накладных и пачек табака
"""

import sys
import json
import base64
from pathlib import Path
from PIL import Image
import pytesseract
from pytesseract import Output

# Настройка языков для распознавания (русский + английский)
TESSERACT_LANG = 'rus+eng'

def recognize_text(image_path):
    """
    Распознает текст с изображения используя Tesseract OCR
    
    Args:
        image_path: путь к изображению
        
    Returns:
        распознанный текст
    """
    try:
        # Открываем изображение
        image = Image.open(image_path)
        
        # Распознаем текст
        # Используем конфигурацию для лучшего распознавания
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, lang=TESSERACT_LANG, config=custom_config)
        
        return text.strip()
    except Exception as e:
        return f"Ошибка распознавания: {str(e)}"


def extract_tobacco_info(tobacco_text):
    """
    Извлекает информацию о табаке из распознанного текста
    
    Args:
        tobacco_text: распознанный текст с пачки табака
        
    Returns:
        словарь с информацией о табаке (бренд, вкус, вес)
    """
    info = {
        'brand': None,
        'taste': None,
        'weight': None
    }
    
    text_lower = tobacco_text.lower()
    text_original = tobacco_text
    
    # Список известных брендов
    brands = [
        'chabacco', 'nur', 'kraken', 'северный', 'bonche', 'burn', 'deus', 
        'muassel', 'darkside', 'dogma', 'jent', 'palitra', 'satyr', 'хулиган',
        'afzal', 'duft', 'must have', 'naш', 'sapphire crown', 'sebero',
        'serbetli', 'spectrum', 'starline', 'сарма', 'overdos', 'bliss',
        'кобра', 'trofimoff', 'overdose', 'mast have', 'star line', 'black burn'
    ]
    
    # Ищем бренд
    for brand in brands:
        if brand.lower() in text_lower:
            info['brand'] = brand.upper() if brand.isupper() or brand.islower() else brand
            break
    
    # Ищем вес (число + г/гр/g)
    import re
    weight_pattern = re.compile(r'(\d+)\s*(?:г|гр|g|grams?)', re.IGNORECASE)
    weight_match = weight_pattern.search(text_original)
    if weight_match:
        try:
            info['weight'] = int(weight_match.group(1))
        except:
            pass
    
    # Ищем вкус в кавычках
    taste_pattern1 = re.compile(r'["«»]([^"«»]+)["«»]', re.IGNORECASE)
    taste_match1 = taste_pattern1.search(text_original)
    if taste_match1:
        info['taste'] = taste_match1.group(1).strip()
    else:
        # Ищем после слова "вкус" или в скобках
        taste_pattern2 = re.compile(r'(?:вкус|taste)[:\s]*([^\n\r]+)', re.IGNORECASE)
        taste_match2 = taste_pattern2.search(text_original)
        if taste_match2:
            taste_candidate = taste_match2.group(1).strip()
            if len(taste_candidate) < 100:
                info['taste'] = taste_candidate
        else:
            # Ищем английское название в скобках
            taste_pattern3 = re.compile(r'\(([A-Za-z\s]+)\)', re.IGNORECASE)
            taste_match3 = taste_pattern3.search(text_original)
            if taste_match3:
                info['taste'] = taste_match3.group(1).strip()
    
    return info


def extract_prices(invoice_text):
    """
    Извлекает цены из текста накладной
    
    Args:
        invoice_text: распознанный текст накладной
        
    Returns:
        список цен
    """
    import re
    prices = []
    
    # Паттерн для поиска цен: число + рубль/₽
    price_pattern = re.compile(r'(\d+(?:[.,]\d+)?)\s*(?:₽|руб|рубл[ейя]|ruble?)', re.IGNORECASE)
    
    for match in price_pattern.finditer(invoice_text):
        try:
            price_str = match.group(1).replace(',', '.')
            price_value = float(price_str)
            prices.append(price_value)
        except:
            pass
    
    return prices


def process_images(invoice_path, tobacco_paths):
    """
    Обрабатывает фото накладной и пачек табака
    
    Args:
        invoice_path: путь к фото накладной (опционально, может быть None)
        tobacco_paths: список путей к фото пачек табака
        
    Returns:
        список распознанных табаков в формате "Бренд - Вкус вес" (без цены, цена подставится на фронтенде)
    """
    # Распознаем текст с накладной (если она есть)
    prices = []
    if invoice_path:
        invoice_text = recognize_text(invoice_path)
        # Извлекаем цены (но они не будут использоваться, так как цены подставляются на фронтенде)
        prices = extract_prices(invoice_text)
    
    # Обрабатываем каждую пачку табака
    recognized_tobaccos = []
    
    for tobacco_path in tobacco_paths:
        tobacco_text = recognize_text(tobacco_path)
        tobacco_info = extract_tobacco_info(tobacco_text)
        
        if tobacco_info['brand'] or tobacco_info['taste']:
            # Формируем строку результата (без цены - цена подставится на фронтенде)
            result_parts = []
            
            if tobacco_info['brand']:
                result_parts.append(tobacco_info['brand'])
            
            if tobacco_info['taste']:
                if result_parts:
                    result_parts.append('-')
                result_parts.append(tobacco_info['taste'])
            
            if tobacco_info['weight']:
                result_parts.append(f"{tobacco_info['weight']}г")
            
            # Цена не добавляется - она будет автоматически подставлена на фронтенде
            # из brandPriceWeightMapping
            
            if result_parts:
                recognized_tobaccos.append(' '.join(result_parts))
    
    return recognized_tobaccos


def parse_invoice(invoice_path):
    """
    Парсит накладную и извлекает позиции табаков
    
    Args:
        invoice_path: путь к фото накладной
        
    Returns:
        список словарей с информацией о позициях (бренд, вкус, вес, количество)
    """
    # Распознаем текст с накладной
    invoice_text = recognize_text(invoice_path)
    
    positions = []
    
    # Разбиваем текст на строки
    lines = invoice_text.split('\n')
    
    # Список известных брендов
    brands = [
        'chabacco', 'nur', 'kraken', 'северный', 'bonche', 'burn', 'deus', 
        'muassel', 'darkside', 'dogma', 'jent', 'palitra', 'satyr', 'хулиган',
        'afzal', 'duft', 'must have', 'naш', 'sapphire crown', 'sebero',
        'serbetli', 'spectrum', 'starline', 'сарма', 'overdos', 'bliss',
        'кобра', 'trofimoff', 'overdose', 'mast have', 'star line', 'black burn'
    ]
    
    import re
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 5:
            continue
        
        position = {
            'brand': None,
            'taste': None,
            'weight': None,
            'quantity': None
        }
        
        line_lower = line.lower()
        
        # Ищем бренд
        for brand in brands:
            if brand.lower() in line_lower:
                position['brand'] = brand.upper() if brand.isupper() or brand.islower() else brand
                break
        
        # Ищем вес (число + г/гр/g)
        weight_pattern = re.compile(r'(\d+)\s*(?:г|гр|g|grams?)', re.IGNORECASE)
        weight_match = weight_pattern.search(line)
        if weight_match:
            try:
                position['weight'] = int(weight_match.group(1))
            except:
                pass
        
        # Ищем количество (число + шт/пачек/pcs)
        quantity_pattern = re.compile(r'(\d+)\s*(?:шт|пачек?|pcs|pc|ед|штук?)', re.IGNORECASE)
        quantity_match = quantity_pattern.search(line)
        if quantity_match:
            try:
                position['quantity'] = int(quantity_match.group(1))
            except:
                pass
        
        # Если количество не найдено по паттерну, ищем число в конце строки
        if position['quantity'] is None:
            # Ищем последнее число в строке (может быть количество)
            numbers = re.findall(r'\d+', line)
            if len(numbers) >= 2:
                # Если есть несколько чисел, последнее может быть количеством
                # (первое - вес, последнее - количество)
                try:
                    last_number = int(numbers[-1])
                    # Проверяем, что это не вес (если есть слово "г" рядом, это вес)
                    if not weight_pattern.search(line.split(str(last_number))[0] if str(last_number) in line else ''):
                        position['quantity'] = last_number
                except:
                    pass
        
        # Ищем вкус в кавычках
        taste_pattern1 = re.compile(r'["«»]([^"«»]+)["«»]', re.IGNORECASE)
        taste_match1 = taste_pattern1.search(line)
        if taste_match1:
            position['taste'] = taste_match1.group(1).strip()
        else:
            # Пробуем найти текст после бренда и до веса/количества
            if position['brand']:
                brand_index = line_lower.find(position['brand'].lower())
                if brand_index >= 0:
                    after_brand = line[brand_index + len(position['brand']):]
                    # Убираем вес и количество
                    after_brand = weight_pattern.sub('', after_brand)
                    after_brand = quantity_pattern.sub('', after_brand)
                    after_brand = re.sub(r'\d+\s*(?:шт|пачек?|pcs)', '', after_brand, flags=re.IGNORECASE)
                    after_brand = after_brand.strip(' -,:;.')
                    if after_brand and len(after_brand) < 100:
                        position['taste'] = after_brand
        
        # Если нашли хотя бы бренд или вкус, добавляем позицию
        if position['brand'] or position['taste']:
            # Если количество не указано, по умолчанию 1
            if position['quantity'] is None:
                position['quantity'] = 1
            positions.append(position)
    
    return positions


def main():
    """
    Главная функция для обработки запросов
    Ожидает JSON с путями к изображениям
    """
    try:
        # Читаем JSON из stdin
        input_data = json.loads(sys.stdin.read())
        
        mode = input_data.get('mode', 'process_images')  # Режим работы
        
        if mode == 'parse_invoice':
            # Режим парсинга накладной
            invoice_path = input_data.get('invoice_path')
            
            if not invoice_path:
                print(json.dumps({'error': 'Не указан путь к фото накладной'}, ensure_ascii=False))
                sys.exit(1)
            
            if not Path(invoice_path).exists():
                print(json.dumps({'error': f'Файл накладной не найден: {invoice_path}'}, ensure_ascii=False))
                sys.exit(1)
            
            # Парсим накладную
            positions = parse_invoice(invoice_path)
            
            # Возвращаем результат
            result = {
                'positions': positions,
                'error': None
            }
            
            print(json.dumps(result, ensure_ascii=False))
        else:
            # Старый режим обработки фото пачек (для обратной совместимости)
            invoice_path = input_data.get('invoice_path')
            tobacco_paths = input_data.get('tobacco_paths', [])
            
            if not tobacco_paths:
                print(json.dumps({'error': 'Не указаны пути к фото пачек табака'}, ensure_ascii=False))
                sys.exit(1)
            
            # Проверяем существование файлов
            if invoice_path and not Path(invoice_path).exists():
                print(json.dumps({'error': f'Файл накладной не найден: {invoice_path}'}, ensure_ascii=False))
                sys.exit(1)
            
            for path in tobacco_paths:
                if not Path(path).exists():
                    print(json.dumps({'error': f'Файл не найден: {path}'}, ensure_ascii=False))
                    sys.exit(1)
            
            # Обрабатываем изображения
            recognized_tobaccos = process_images(invoice_path, tobacco_paths)
            
            # Возвращаем результат
            result = {
                'recognized_tobaccos': recognized_tobaccos,
                'error': None
            }
            
            print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({'error': f'Ошибка обработки: {str(e)}'}, ensure_ascii=False))
        sys.exit(1)


if __name__ == '__main__':
    main()
