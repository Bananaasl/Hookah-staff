// Утилиты и вспомогательные функции
class Utils {
    constructor() {}

    // Получение CSS класса для крепости
    getFortressClass(fortress) {
        if (fortress <= 2) return 'fortress-light';
        if (fortress <= 4) return 'fortress-medium';
        return 'fortress-strong';
    }

    // Получение текстового описания крепости
    getFortressText(fortress) {
        if (fortress <= 2) return 'Легкий';
        if (fortress <= 4) return 'Средний';
        return 'Крепкий';
    }

    // Функция для получения веса инвентаризации в граммах
    getInventoryWeightInGrams(tobacco) {
        const inventoryWeight = tobacco.inventoryWeight || 0;
        const orderWeight = tobacco.weight || 0; // weight может быть null для текущего привоза
        
        // Если weight не указан, возвращаем inventoryWeight как есть
        if (!orderWeight || orderWeight === 0) {
            return inventoryWeight;
        }
        
        // Если inventoryWeight больше orderWeight, значит это процент
        if (inventoryWeight > orderWeight && inventoryWeight <= 100) {
            // Это процент, конвертируем в граммы
            return Math.round((inventoryWeight / 100) * orderWeight);
        }
        
        // Иначе это уже граммы
        return inventoryWeight;
    }

    // Расчет процента использования
    calculateUsagePercentage(tobacco) {
        const orderWeight = tobacco.weight || 0; // weight может быть null для текущего привоза
        const inventoryWeightInGrams = this.getInventoryWeightInGrams(tobacco);
        
        // Если weight не указан, возвращаем 0 (не можем рассчитать использование)
        if (!orderWeight || orderWeight === 0) return 0;
        
        const usedWeight = orderWeight - inventoryWeightInGrams;
        const percentage = (usedWeight / orderWeight) * 100;
        
        return Math.max(0, Math.min(100, Math.round(percentage)));
    }

    // Получение цвета для процента использования
    getUsageColor(percentage) {
        if (percentage <= 30) return '#28a745'; // Зеленый - мало использован
        if (percentage <= 70) return '#ffc107'; // Желтый - средне использован
        return '#dc3545'; // Красный - много использован
    }

    // Форматирование даты
    formatDate(dateString) {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU');
    }

    // Форматирование валюты
    formatCurrency(amount) {
        return `${Math.round(amount || 0)} ₽`;
    }

    // Валидация email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Валидация пароля
    isValidPassword(password) {
        return password && password.length >= 6;
    }

    // Очистка строки от лишних пробелов
    trimString(str) {
        return str ? str.trim() : '';
    }

    // Проверка на пустую строку
    isEmpty(str) {
        return !str || str.trim().length === 0;
    }

    // Дебаунс функция
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Троттлинг функция
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Копирование в буфер обмена
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Ошибка копирования в буфер обмена:', err);
            return false;
        }
    }

    // Генерация уникального ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Проверка на мобильное устройство
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Локальное хранилище с обработкой ошибок
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
            return false;
        }
    }

    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Ошибка чтения из localStorage:', error);
            return null;
        }
    }

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Ошибка удаления из localStorage:', error);
            return false;
        }
    }

    // Форматирование размера файла
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Случайное число в диапазоне
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Проверка на число
    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // Округление до указанного количества знаков
    roundTo(value, decimals = 2) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    // Экранирование HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Создание элемента с атрибутами
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    }

    // Анимация появления элемента
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Анимация исчезновения элемента
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Подсчет количества каждого элемента в массиве
    countOccurrences(array) {
        return array.reduce((counts, item) => {
            counts[item] = (counts[item] || 0) + 1;
            return counts;
        }, {});
    }

    // Удаление дубликатов из массива
    removeDuplicates(array) {
        return [...new Set(array)];
    }

    // Группировка массива по ключу
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    // Сортировка массива объектов по ключу
    sortBy(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
            } else {
                return aVal > bVal ? 1 : -1;
            }
        });
    }
}

// Создаем глобальный экземпляр утилит
const utils = new Utils();

