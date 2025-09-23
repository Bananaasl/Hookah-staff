// Основной класс приложения Hookah Staff
class HookahStaffApp {
    constructor() {
        this.tobaccos = [];
        this.multiBrands = []; // Список брендов с вкусами для множественного добавления
        this.showMultiBrandForm = false;
        this.currentUser = null;
        this.currentDelivery = null;
        this.finalizedDeliveries = [];
        this.activeTab = 'current'; // 'current' или 'history'
        this.showDeliveryModal = false;
        this.selectedDelivery = null;
        
        // Данные для рекомендаций
        this.brandSuggestions = ['CHABACO', 'Nur', 'Kraken', 'Северный', 'Bonche', 'Burn', 'Deus', 'Muassel', 'Darkside', 'Dogma', 'JENT', 'Palitra', 'Satyr', 'Хулиган', 'Afzal', 'Duft', 'Must Have', 'NAШ', 'Sapphire Crown', 'Sebero', 'Serbetli', 'Spectrum', 'Starline', 'Сарма', 'Overdos', 'Darkside Sabotage', 'JENT CIGAR', 'Догма', 'BLISS', 'КОБРА', 'Сарма 360', 'SEBERO CLASSIC', 'SEBERO BLACK', 'NАШ', 'NАШ Cigar', 'Trofimoff', 'BlackBurn', 'Overdose', 'Mast Have', 'Star line', 'SEBERO'];
        // Общие рекомендации вкусов (для брендов без специфических вкусов)
        this.tasteSuggestions = ['Малина', 'Смородина', 'Супернова', 'Груша', 'Липа', 'Бергамот', 'Клубника', 'Апельсин', 'Мята', 'Лимон', 'Киви', 'Персик', 'Ананас', 'Кокос', 'Ваниль'];
        
        // Маппинг вкусов для конкретных брендов (полные данные с OPTRF Store)
        this.brandTasteMapping = {
            // Точные данные с OPTRF Store
            'CHABACO': [
                'Астраханский Арбуз', 'Виноградные Леденцы', 'Кивано Маракуйя', 
                'Клубничный Милкшейк', 'Смородиновый Крамбл', 'Сырные палочки', 
                'Апельсиновое Драже'
            ],
            'Nur': [
                'Пина Колада', 'Роза Сосна', 'Русские Ягоды', 'Свежие Ягоды', 
                'Фейхоа Малина', 'Хвоя Фейхоа', 'Черничный Маффин', 'Чернослив Ром Ягоды',
                'Шоколад Мята', 'Эвкалипт Сосна Ягоды', 'Это Любовь', 'Ягодный Крем', 'Японский Виноград'
            ],
            'Kraken': [
                'Strong Ligero (сигары)', 'Black Corn (Черная кукуруза)', 'Porto Ruby (Портвейн)',
                'Rum Cake (Ромовый кекс)', 'Pirate Rum (Пиратский ром)', 'Yubari Melon (Дыня Юбари)', 
                'Mango Alphonso (Манго)', 'Guava Supreme (Гуава)', 'Creme Brulee (Крем Брюле)',
                'Medium серия', 'Strong серия'
            ],
            'Северный': [
                'Зеленая Миля', 'Классический', 'Премиум', 'Северный Mix', 'Ягодный Коктейль',
                'Цитрусовый Фреш', 'Тропический Микс', 'Мятная Свежесть', 'Лесные Ягоды',
                'Арктический Ветер', 'Северное Сияние'
            ],
            'Bonche': [
                'Base (Табачный)', 'Bergamot (Бергамот)', 'Blueberry (Черника)', 'Brownie (Брауни)', 
                'Caramel (Карамель)', 'Cheesecake (Чизкейк)', 'Coconut (Кокос)', 'Coffee (Кофе)', 
                'Cognac (Коньяк)', 'Cookie (Печенье)', 'Dark Chocolate (Темный шоколад)', 'Ginger (Имбирь)', 
                'Honey (Мёд)', 'Lemon (Лимон)', 'Lemongrass (Лемонграсс)', 'Lychee (Личи)', 
                'Marzipan (Марципан)', 'Melissa (Мелисса)', 'Olive (Оливки)', 'Orange (Апельсин)', 
                'Passion Fruit (Маракуйя)', 'Peanut (Арахис)', 'Pineapple (Ананас)', 'Pomegranate (Гранат)', 
                'Rum (Ром)', 'Salami (Салями)', 'Strawberry (Клубника)', 'Sweet Corn (Кукуруза)', 
                'Vanilla (Ваниль)', 'Whiskey (Виски)', 'Wild Strawberry (Земляника)', 'Barberry (Барбарис)', 
                'Basil (Базилик)', 'Cherry (Вишня)', 'Clove (Гвоздика)', 'Grapefruit (Грейпфрут)', 
                'Hoob (Амаретто Грейпфрут Личи Алоэ)', 'Lavender (Лаванда)', 'Mango (Манго)', 
                'New Year 2025 (Запеченый персик с карамелью и трюфелем)', 'Raspberry (Малина)', 'Red Wine (Красное Вино)',
                'Kiwi', 'Smena', 'Текила Ананас Лайм'
            ],
            'Burn': [
                'Black White Grape (Белый Виноград)', 'Black Gooseberry Shock (Кислый Крыжовник)', 
                'Wild Berries (Дикие Ягоды)', 'Tropical Mix (Тропический Микс)', 
                'Berry Mix (Ягодный Микс)', 'Mint (Мята)', 'Apple (Яблоко)', 
                'Melon (Дыня)', 'Citrus (Цитрус)', 'Peach (Персик)', 'Pineapple (Ананас)'
            ],
            'Muassel': [
                'Черника Малина', 'Цитрусовый Манго', 'Сочный Манго',
                'Сладкий Кактус', 'Розовый Закат', 'Папайа', 'Мятная Свежесть',
                'Малина Садовая', 'Киви', 'Жвачка с Корицей', 'Двойное Яблоко',
                'Гуаманго', 'Экзотические Фрукты', 'Шоколад с Мятой', 'Шипучка',
                'Черника Малина', 'Цитрусовый Фреш', 'Цитрусовый Манго', 'Холодная Гренада'
            ],
            // Популярные вкусы для других брендов (на основе рыночных данных)
            'Darkside': [
                'Supernova', 'Mango Lassi', 'Wild Berries', 'Grape', 'Melon', 'Citrus',
                'Tropical Mix', 'Berry Mix', 'Mint', 'Apple', 'Peach', 'Pineapple'
            ],
            'JENT': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Sapphire Crown': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Afzal': [
                'Pan Rasna', 'Pan Raas', 'Red Cherry', 'Grape', 'Strawberry', 'Mint',
                'Apple', 'Melon', 'Rose', 'Paan', 'Double Apple'
            ],
            'Duft': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Spectrum': [
                'Apple Cider (Яблочный сидр)', 'Bang Banana (Банан)', 'Brazilian Tea (Бразильский чай)', 
                'Crystal (Лёд)', 'Garden Berry (Садовые ягоды)'
            ],
            'Trofimoff': [
                'Dark Plum (Плотная Тёмная Слива)', 'Double Apple (Родная «Двойнушка»)', 'Elder Flowers', 
                'Finlandia Vanila', 'Grapefruit (Грейпфрутовый Сок)', 'Green Apple', 'Hurtleberry (Черная Смородина)', 
                'Kiwi', 'Kriek (Бельгийская Вишня Черешня)', 'Lavander (Лаванда)', 'Limoncello', 
                'Mangifera (Сливочный Манго)', 'Mint (Освежающий Ментол)', 'Nobilis ("Молодая" Сосна)', 
                'Old School Orange (Тот Самый Апельсин)', 'Opuntia Pear (Сочная Кактусовая Груша)', 
                'Pan Banan (Выразительный Банан)', 'Peach', 'Pop Corn (Карамельный Попкорн)', 
                'Red Currant (Вкуснейшая Смородина)', 'Sri Lanka (Элитарный Чай)', 
                'Tangerine (Морокканский Мандарин)', 'The Rose (Яркая Цветочная Роза)', 
                'Watermelon (Бахчевой Арбуз)', 'Wild Strawberry (Дикая Земляника)', 'Yellow Lemon (Лимон)'
            ],
            'BlackBurn': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Overdose': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'NАШ': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Сарма': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'SEBERO': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Mast Have': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Overdos': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Deus': [
                'Perfume Psychedelic Love (Парфюм Психоделическая Любовь)', 'Supernova (Супернова)', 
                'Mango Lassi (Манго Ласси)', 'Wild Berries (Дикие Ягоды)', 'Grape (Виноград)', 
                'Melon (Дыня)', 'Citrus (Цитрус)', 'Tropical Mix (Тропический Микс)', 
                'Berry Mix (Ягодный Микс)', 'Mint (Мята)', 'Apple (Яблоко)', 'Peach (Персик)', 
                'Pineapple (Ананас)', 'Orange (Апельсин)', 'Lemon (Лимон)'
            ],
            'Darkside Sabotage': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'JENT CIGAR': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Хулиган': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Догма': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'BLISS': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'КОБРА': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Сарма 360': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'SEBERO CLASSIC': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'SEBERO BLACK': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'NАШ Cigar': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Palitra': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Satyr': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ],
            'Star line': [
                'Grape', 'Strawberry', 'Mint', 'Apple', 'Melon', 'Citrus', 'Berry Mix',
                'Tropical Mix', 'Peach', 'Pineapple', 'Orange', 'Lemon'
            ]
        };
        
        // Маппинг цен и весов для конкретных брендов (полные данные с OPTRF Store)
        this.brandPriceWeightMapping = {
            // Точные данные с OPTRF Store
            'CHABACO': [
                { price: 205, weight: 50 },  // 50г-205₽ (с OPTRF)
                { price: 950, weight: 200 }  // 200г-950₽ (с OPTRF)
            ],
            'Nur': [
                { price: 380, weight: 20 }   // 20г-380₽ (с OPTRF)
            ],
            'Kraken': [
                { price: 3290, weight: 80 },  // 80г-3290₽ (сигары с OPTRF)
                { price: 565, weight: 30 },   // 30г-565₽ (табак с OPTRF)
                { price: 1695, weight: 100 }, // 100г-1695₽ (табак с OPTRF)
                { price: 4025, weight: 250 }  // 250г-4025₽ (табак с OPTRF)
            ],
            'Bonche': [
                { price: 640, weight: 30 },  // 30г-640₽ (с OPTRF)
                { price: 1900, weight: 120 } // 120г-1900₽ (с OPTRF)
            ],
            'Burn': [
                { price: 200, weight: 25 },  // 25г-200₽ (с OPTRF)
                { price: 715, weight: 100 }, // 100г-715₽ (с OPTRF)
                { price: 1400, weight: 200 } // 200г-1400₽ (с OPTRF)
            ],
            'Deus': [
                { price: 5750, weight: 200 }, // 200г-5750₽ (с OPTRF)
                { price: 750, weight: 100 },  // 100г-750₽ (общие данные)
                { price: 1450, weight: 200 }  // 200г-1450₽ (общие данные)
            ],
            'Muassel': [
                { price: 340, weight: 40 },  // 40г-340₽ (6/10 с OPTRF)
                { price: 425, weight: 40 },  // 40г-425₽ (8/10 с OPTRF)
                { price: 1550, weight: 200 } // 200г-1550₽ (с OPTRF)
            ],
            // Бренды, представленные на OPTRF но без конкретных цен (используем рыночные данные)
            'Darkside': [
                { price: 850, weight: 100 },
                { price: 1650, weight: 200 }
            ],
            'Dogma': [
                { price: 720, weight: 100 },
                { price: 1400, weight: 200 }
            ],
            'JENT': [
                { price: 680, weight: 100 },
                { price: 1350, weight: 200 }
            ],
            'Palitra': [
                { price: 680, weight: 100 },
                { price: 1350, weight: 200 }
            ],
            'Satyr': [
                { price: 700, weight: 100 },
                { price: 1400, weight: 200 }
            ],
            'Хулиган': [
                { price: 720, weight: 100 },
                { price: 1400, weight: 200 }
            ],
            'Afzal': [
                { price: 600, weight: 100 },
                { price: 1200, weight: 200 }
            ],
            'Duft': [
                { price: 700, weight: 100 },
                { price: 1350, weight: 200 }
            ],
            'Must Have': [
                { price: 800, weight: 100 },
                { price: 1550, weight: 200 }
            ],
            'NAШ': [
                { price: 650, weight: 100 },
                { price: 1300, weight: 200 }
            ],
            'Sapphire Crown': [
                { price: 700, weight: 100 },
                { price: 1350, weight: 200 }
            ],
            'Sebero': [
                { price: 730, weight: 100 },
                { price: 1450, weight: 200 }
            ],
            'Serbetli': [
                { price: 580, weight: 100 },
                { price: 1150, weight: 200 }
            ],
            'Spectrum': [
                { price: 205, weight: 25 },   // 25г-205₽ (с OPTRF)
                { price: 760, weight: 100 },  // 100г-760₽ (с OPTRF)
                { price: 1350, weight: 200 }  // 200г-1350₽ (с OPTRF)
            ],
            'Starline': [
                { price: 650, weight: 100 },
                { price: 1280, weight: 200 }
            ],
            'Сарма': [
                { price: 1350, weight: 200 },
                { price: 700, weight: 100 },
                { price: 290, weight: 40 },
                { price: 190, weight: 25 }
            ],
            'Северный': [
                { price: 1300, weight: 200 },
                { price: 680, weight: 100 },
                { price: 285, weight: 40 }
            ],
            // Бренды, которых нет на OPTRF (используем общие рекомендации)
            'Overdos': [
                { price: 810, weight: 100 },
                { price: 1600, weight: 200 }
            ],
            'Darkside Sabotage': [
                { price: 850, weight: 100 },
                { price: 1650, weight: 200 }
            ],
            'JENT CIGAR': [
                { price: 750, weight: 100 },
                { price: 1500, weight: 200 }
            ],
            'Догма': [
                { price: 720, weight: 100 },
                { price: 1400, weight: 200 }
            ],
            'BLISS': [
                { price: 700, weight: 100 },
                { price: 1350, weight: 200 }
            ],
            'КОБРА': [
                { price: 750, weight: 100 },
                { price: 1450, weight: 200 }
            ],
            'Сарма 360': [
                { price: 1350, weight: 200 },
                { price: 700, weight: 100 },
                { price: 290, weight: 40 },
                { price: 190, weight: 25 }
            ],
            'SEBERO CLASSIC': [
                { price: 730, weight: 100 },
                { price: 1450, weight: 200 }
            ],
            'SEBERO BLACK': [
                { price: 780, weight: 100 },
                { price: 1500, weight: 200 }
            ],
            'NАШ': [
                { price: 650, weight: 100 },
                { price: 1300, weight: 200 }
            ],
            'NАШ Cigar': [
                { price: 650, weight: 100 },
                { price: 1300, weight: 200 }
            ],
            'Trofimoff': [
                { price: 900, weight: 125 }
            ],
            'BlackBurn': [
                { price: 715, weight: 100 },
                { price: 1400, weight: 200 }
            ],
            'Overdose': [
                { price: 810, weight: 100 },
                { price: 1600, weight: 200 }
            ],
            'Mast Have': [
                { price: 800, weight: 100 },
                { price: 1550, weight: 200 }
            ],
            'Star line': [
                { price: 650, weight: 100 },
                { price: 1280, weight: 200 }
            ],
            'SEBERO': [
                { price: 730, weight: 100 },
                { price: 1450, weight: 200 }
            ]
        };
        
        // Общие рекомендации цен (для брендов без специфических цен)
        this.priceSuggestions = [720, 1200, 2000];
        
        // Общий маппинг цен на веса (для брендов без специфических цен)
        this.priceToWeightMapping = {
            720: 100,
            1200: 125,
            2000: 200
        };
        
        this.init();
    }

    async init() {
        // Проверяем, есть ли сохраненный токен
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            // Здесь можно добавить проверку токена на сервере
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            await this.loadData();
        } else {
            this.render();
        }
    }

    async loadData() {
        await this.loadTobaccos();
        await this.loadCurrentDelivery();
        await this.loadFinalizedDeliveries();
        this.render();
    }

    async loadTobaccos() {
        const result = await apiService.loadTobaccos();
        if (result.success) {
            this.tobaccos = result.data;
            console.log('Загружено табаков:', this.tobaccos.length);
        } else {
            this.tobaccos = [];
            this.showNotification('Ошибка загрузки данных', 'error');
        }
    }

    async loadCurrentDelivery() {
        const result = await apiService.loadCurrentDelivery();
        this.currentDelivery = result.data;
    }

    async loadFinalizedDeliveries() {
        const result = await apiService.loadFinalizedDeliveries();
        this.finalizedDeliveries = result.data;
    }

    logout() {
        this.currentUser = null;
        this.tobaccos = [];
        this.currentDelivery = null;
        this.finalizedDeliveries = [];
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.render();
        this.showNotification('Вы вышли из системы', 'info');
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.render();
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        this.login(username, password);
    }

    toggleMultiBrandForm() {
        this.showMultiBrandForm = !this.showMultiBrandForm;
        if (this.showMultiBrandForm) {
            // Инициализируем с одним брендом, если список пуст
            if (this.multiBrands.length === 0) {
                this.addNewBrand();
            }
        }
        this.render();
    }

    addNewBrand() {
        this.multiBrands.push({
            brandName: '',
            fortress: 1,
            price: 720, // Устанавливаем цену по умолчанию
            weight: 100, // Устанавливаем вес по умолчанию (соответствует цене 720₽)
            orderDate: new Date().toISOString().split('T')[0],
            inventoryDate: new Date().toISOString().split('T')[0],
            tastes: []
        });
        this.render();
    }

    removeBrand(index) {
        this.multiBrands.splice(index, 1);
        this.render();
    }

    updateBrand(index, field, value) {
        if (this.multiBrands[index]) {
            this.multiBrands[index][field] = value;
            
            // Если изменилась цена, автоматически обновляем вес
            if (field === 'price') {
                const brand = this.multiBrands[index];
                if (brand.brandName) {
                    const brandMapping = this.brandPriceWeightMapping[brand.brandName];
                    if (brandMapping) {
                        // Ищем соответствующую запись для данного бренда и цены
                        const matchingEntry = brandMapping.find(entry => entry.price === value);
                        if (matchingEntry) {
                            this.multiBrands[index].weight = matchingEntry.weight;
                        }
                    } else {
                        // Используем общий маппинг для брендов без специфических цен
                        const weight = this.priceToWeightMapping[value];
                        if (weight) {
                            this.multiBrands[index].weight = weight;
                        }
                    }
                }
            }
            
            this.render();
        }
    }

    updateBrandTastes(index, tastesText) {
        if (this.multiBrands[index]) {
            this.multiBrands[index].tastes = tastesText
                .split(',')
                .map(taste => taste.trim())
                .filter(taste => taste.length > 0);
            this.render();
        }
    }

    // Функция для подсчета количества каждого вкуса
    getTasteCounts(tastes) {
        const counts = {};
        tastes.forEach(taste => {
            counts[taste] = (counts[taste] || 0) + 1;
        });
        return counts;
    }

    // Функция для удаления одного экземпляра вкуса
    removeTasteSuggestion(brandIndex, taste) {
        const currentTastes = this.multiBrands[brandIndex].tastes;
        const index = currentTastes.indexOf(taste);
        if (index > -1) {
            currentTastes.splice(index, 1);
            this.updateBrandTastes(brandIndex, currentTastes.join(', '));
        }
    }

    async login(username, password) {
        const result = await apiService.login(username, password);
        if (result.success) {
            this.currentUser = result.data;
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            await this.loadData();
            this.showNotification(`Добро пожаловать, ${result.data.username}!`, 'success');
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async createNewDelivery() {
        const result = await apiService.createNewDelivery(this.currentUser.username);
        if (result.success) {
            this.currentDelivery = result.data;
            this.showNotification('Новый привоз создан!', 'success');
            this.render();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async createNewDeliveryWithForm() {
        const result = await apiService.createNewDelivery(this.currentUser.username);
        if (result.success) {
            this.currentDelivery = result.data;
            this.showMultiBrandForm = true;
            this.showNotification('Новый привоз создан! Теперь добавьте табаки.', 'success');
            this.render();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async finalizeDelivery() {
        if (!this.currentDelivery) {
            this.showNotification('Нет активного привоза для завершения', 'error');
            return;
        }

        if (!confirm('Вы уверены, что хотите завершить этот привоз? После завершения его нельзя будет изменить.')) {
            return;
        }

        const result = await apiService.finalizeDelivery(this.currentDelivery.id, this.currentUser.username);
        if (result.success) {
            this.showNotification('Привоз успешно завершен!', 'success');
            await this.loadData();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async cancelDelivery() {
        if (!this.currentDelivery) {
            this.showNotification('Нет активного привоза для отмены', 'error');
            return;
        }

        if (!confirm('Вы уверены, что хотите отменить этот привоз? Все добавленные табаки будут удалены.')) {
            return;
        }

        const result = await apiService.cancelDelivery(this.currentDelivery.id);
        if (result.success) {
            this.showNotification('Привоз успешно отменен!', 'success');
            await this.loadData();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async showDeliveryDetails(deliveryId) {
        const result = await apiService.getDeliveryDetails(deliveryId);
        if (result.success) {
            this.selectedDelivery = { id: deliveryId, tobaccos: result.data.tobaccos, cost: result.data.cost };
            this.showDeliveryModal = true;
            this.render();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    closeDeliveryModal() {
        this.showDeliveryModal = false;
        this.selectedDelivery = null;
        this.render();
    }

    async handleMultiBrandAddTobaccos() {
        // Проверяем, есть ли активный привоз
        if (!this.currentDelivery) {
            this.showNotification('Сначала создайте привоз', 'error');
            return;
        }

        // Валидация формы
        if (this.multiBrands.length === 0) {
            alert('Пожалуйста, добавьте хотя бы один бренд');
            return;
        }

        for (let i = 0; i < this.multiBrands.length; i++) {
            const brand = this.multiBrands[i];
            
            if (!brand.brandName || brand.brandName.trim() === '') {
                alert(`Пожалуйста, введите название бренда для бренда ${i + 1}`);
                return;
            }
            
            if (!brand.price || brand.price <= 0) {
                alert(`Пожалуйста, введите корректную цену для бренда "${brand.brandName}"`);
                return;
            }
            
            if (!brand.weight || brand.weight <= 0) {
                alert(`Пожалуйста, введите корректный вес для бренда "${brand.brandName}"`);
                return;
            }

            if (brand.tastes.length === 0) {
                alert(`Пожалуйста, введите хотя бы один вкус для бренда "${brand.brandName}"`);
                return;
            }
        }

        // Показываем индикатор загрузки
        const saveButton = document.querySelector('.save-button');
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Сохранение...';
        saveButton.disabled = true;

        const result = await apiService.addMultiBrandTobaccos(this.currentDelivery.id, this.multiBrands);
        
        if (result.success) {
            // Сохраняем количество добавленных табаков перед очисткой
            const addedCount = this.multiBrands.reduce((total, brand) => total + brand.tastes.length, 0);
            
            // Успешное сохранение
            await this.loadTobaccos();
            this.multiBrands = [];
            // Закрываем форму после добавления табаков
            this.showMultiBrandForm = false;
            
            // Обновляем интерфейс
            this.render();
            
            // Показываем уведомление об успехе
            this.showNotification(`Успешно добавлено ${addedCount} табаков в привоз!`, 'success');
        } else {
            this.showNotification('Ошибка при добавлении табаков: ' + result.error, 'error');
        }

        // Восстанавливаем кнопку
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    }

    async handleDeleteTobacco(id) {
        if (!confirm('Вы уверены, что хотите удалить этот табак?')) {
            return;
        }

        const result = await apiService.deleteTobacco(id);
        if (result.success) {
            await this.loadTobaccos();
            this.updateTable();
            this.showNotification('Табак успешно удален!', 'success');
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async updateInventoryWeight(tobaccoId, newWeight) {
        try {
            const tobacco = this.tobaccos.find(t => t.id === tobaccoId);
            if (!tobacco) return;

            const weightInGrams = parseInt(newWeight);
            const maxWeight = tobacco.weight || 50;
            
            // Валидация: вес инвентаризации не может быть больше исходного веса
            if (weightInGrams > maxWeight) {
                alert(`Вес инвентаризации не может быть больше ${maxWeight} г`);
                return;
            }
            
            if (weightInGrams < 0) {
                alert('Вес инвентаризации не может быть отрицательным');
                return;
            }

            const updatedTobacco = {
                ...tobacco,
                inventoryWeight: weightInGrams,
                inventoryDate: new Date().toISOString().split('T')[0]
            };

            const result = await apiService.updateInventoryWeight(tobaccoId, updatedTobacco);
            
            if (result.success) {
                // Обновляем локальные данные
                tobacco.inventoryWeight = weightInGrams;
                tobacco.inventoryDate = new Date().toISOString().split('T')[0];
                
                // Обновляем только строку таблицы
                this.updateTableRow(tobaccoId);
                
                this.showNotification('Вес инвентаризации обновлен!', 'success');
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Ошибка при обновлении веса инвентаризации:', error);
            this.showNotification('Ошибка при обновлении веса инвентаризации', 'error');
        }
    }

    // Функции для работы с рекомендациями
    selectBrandSuggestion(brandIndex, brandName) {
        this.updateBrand(brandIndex, 'brandName', brandName);
    }

    selectTasteSuggestion(brandIndex, taste) {
        const currentTastes = this.multiBrands[brandIndex].tastes;
        // Добавляем вкус каждый раз при нажатии (убираем проверку на дубликаты)
        currentTastes.push(taste);
        this.updateBrandTastes(brandIndex, currentTastes.join(', '));
    }

    selectWeightSuggestion(brandIndex, weight) {
        this.updateBrand(brandIndex, 'weight', weight);
    }

    selectPriceSuggestion(brandIndex, price) {
        this.updateBrand(brandIndex, 'price', price);
        // Автоматически устанавливаем вес в зависимости от цены и бренда
        const brand = this.multiBrands[brandIndex];
        if (brand && brand.brandName) {
            const brandMapping = this.brandPriceWeightMapping[brand.brandName];
            if (brandMapping) {
                // Ищем соответствующую запись для данного бренда и цены
                const matchingEntry = brandMapping.find(entry => entry.price === price);
                if (matchingEntry) {
                    this.updateBrand(brandIndex, 'weight', matchingEntry.weight);
                }
            } else {
                // Используем общий маппинг для брендов без специфических цен
                const weight = this.priceToWeightMapping[price];
                if (weight) {
                    this.updateBrand(brandIndex, 'weight', weight);
                }
            }
        }
    }

    showNotification(message, type = 'info') {
        uiRenderer.showNotification(message, type);
    }

    render() {
        const app = document.getElementById('root');
        
        if (!this.currentUser) {
            app.innerHTML = uiRenderer.renderLoginForm();
            return;
        }

        app.innerHTML = `
            <div class="app">
                <div class="header">
                    <div class="header-content">
                        <div class="header-center">
                            <h1>Hookah Staff</h1>
                            <p>Управление табаками для кальянной</p>
                        </div>
                        <div class="header-profile">
                            <div class="profile-info">
                                <div class="profile-role">${this.currentUser.roleDisplayName}</div>
                                <div class="profile-username">${this.currentUser.username}</div>
                            </div>
                            <button class="logout-button" onclick="app.logout()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>
                                </svg>
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>

                <div class="tabs">
                    <button class="tab-button ${this.activeTab === 'current' ? 'active' : ''}" onclick="app.switchTab('current')">
                        Текущий привоз
                    </button>
                    <button class="tab-button ${this.activeTab === 'history' ? 'active' : ''}" onclick="app.switchTab('history')">
                        Прошлые привозы
                    </button>
                </div>

                ${this.activeTab === 'current' ? uiRenderer.renderCurrentTab(this) : uiRenderer.renderHistoryTab(this)}
            </div>
            
            ${this.showDeliveryModal ? uiRenderer.renderDeliveryModal(this) : ''}
        `;
    }

    updateTableRow(tobaccoId) {
        const tobacco = this.tobaccos.find(t => t.id === tobaccoId);
        if (!tobacco) return;

        const usagePercentage = utils.calculateUsagePercentage(tobacco);
        const usageColor = utils.getUsageColor(usagePercentage);

        // Находим строку таблицы и обновляем колонки
        const table = document.querySelector('.table tbody');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const deleteButton = row.querySelector('.delete-button');
                if (deleteButton && deleteButton.onclick.toString().includes(tobaccoId)) {
                    // Обновляем колонку "Вес на инвентаризации" (индекс 7)
                    const inventoryWeightCell = row.cells[7];
                    if (inventoryWeightCell) {
                        inventoryWeightCell.innerHTML = `
                            <input 
                                type="number" 
                                value="${utils.getInventoryWeightInGrams(tobacco)}" 
                                min="0" 
                                max="${tobacco.weight || 50}"
                                style="width: 100%; max-width: 80px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.9rem;"
                                onchange="app.updateInventoryWeight(${tobacco.id}, this.value)"
                            /> г
                        `;
                    }
                    
                    // Обновляем колонку "Использование" (индекс 8)
                    const usageCell = row.cells[8];
                    if (usageCell) {
                        usageCell.innerHTML = `
                            <span style="color: ${usageColor}; font-weight: bold;">
                                ${usagePercentage}%
                            </span>
                        `;
                    }
                }
            });
        }
    }

    updateTable() {
        // Обновляем только таблицу и статистику
        const tobaccoList = document.querySelector('.tobacco-list');
        if (tobaccoList) {
            tobaccoList.innerHTML = `
                <div class="tobacco-table">
                    <div class="table-header">
                        <h3>Каталог табаков</h3>
                    </div>
                    ${uiRenderer.renderTobaccoTable(this)}
                </div>
            `;
        }

        // Обновляем статистику
        const stats = document.querySelector('.stats');
        if (stats) {
            stats.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${this.tobaccos.length}</div>
                    <div class="stat-label">Табаков в каталоге</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        ${this.tobaccos.length > 0 ? Math.round(this.tobaccos.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0)) : 0}
                    </div>
                    <div class="stat-label">Стоимость привоза (₽)</div>
                </div>
            `;
        }
    }
}

// Инициализация приложения
const app = new HookahStaffApp();
