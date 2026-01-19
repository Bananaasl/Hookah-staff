// Основной класс приложения Hookah Staff
class HookahStaffApp {
    constructor() {
        this.tobaccos = [];
        this.multiBrands = []; // Список брендов с вкусами для множественного добавления
        this.showMultiBrandForm = false;
        this.showOcrForm = false;
        this.ocrPreview = null;
        this.ocrParsedData = []; // Распарсенные данные с автоматически подставленными ценами
        this.currentUser = null;
        this.currentDelivery = null;
        this.finalizedDeliveries = [];
        this.shelfRatingTobaccos = []; // Табаки для оценки полки
        this.activeTab = 'current'; // 'current', 'history' или 'shelf-rating'
        this.showDeliveryModal = false;
        this.selectedDelivery = null;
        
        // Данные для рекомендаций
        this.brandSuggestions = ['CHABACCO', 'Nur', 'Kraken', 'Северный', 'Bonche', 'Burn', 'Deus', 'Muassel', 'Darkside', 'Dogma', 'JENT', 'Palitra', 'Satyr', 'Хулиган', 'Afzal', 'Duft', 'Must Have', 'NAШ', 'Sapphire Crown', 'Sebero', 'Serbetli', 'Spectrum', 'Starline', 'Сарма', 'Overdos', 'Darkside Sabotage', 'JENT CIGAR', 'Догма', 'BLISS', 'КОБРА', 'Сарма 360', 'SEBERO CLASSIC', 'SEBERO BLACK', 'NАШ', 'NАШ Cigar', 'Trofimoff', 'Black Burn', 'Overdose', 'Mast Have', 'Star line', 'SEBERO'];
        // Общие рекомендации вкусов (для брендов без специфических вкусов)
        this.tasteSuggestions = ['Малина', 'Смородина', 'Супернова', 'Груша', 'Липа', 'Бергамот', 'Клубника', 'Апельсин', 'Мята', 'Лимон', 'Киви', 'Персик', 'Ананас', 'Кокос', 'Ваниль'];
        
        // Маппинг вкусов для конкретных брендов (данные с oshisha.cc)
        this.brandTasteMapping = {
            // Данные с oshisha.cc/catalog/chabacco/
            'CHABACCO': {
                40: [ // 40г - 220₽
                    'Orange Cream (Апельсин-Сливки)', 'Wild Cherry (Дикая Вишня)', 'Cola (Кола)', 
                    'Grenadine drops (Гренадиновые Леденцы)', 'Kiwano-passion fruit (Кивано Маракуйя)', 
                    'Northern Berries (Северные Ягоды)', 'Blueberry mint (Черника с Мятой)', 
                    'Orange Dragee (Апельсиновые Драже)', 'Jasmine Tea (Жасминовый Чай)', 
                    'Jasmine mochi (Жасминовые Моти)', 'Banana Milkshake (Банановый Милкшейк)', 
                    'Pistachio Ice Cream (Фисташковое Мороженое)', 'Sour jelly (Кислые Желейные Конфеты)', 
                    'Energy Drink & Kiwi (Энергетик с Киви)', 'Cherry Cola (Вишневая Кола)', 
                    'Cranberries in powdered sugar (Клюква в Сахарной Пудре)', 'Ice (Лёд)', 
                    'Ice Bonbon (Ледяные Бонбоны)', 'Raspberry Rafaella (Малиновая Рафаэлла)', 
                    'Pomelo (Помело)', 'Mango Yogurt (Манговый Йогурт)', 
                    'Lemon Jelly Slices (Лимонные Желейные Дольки)', 'Black Currant Crumble (Черносмородиновый Крамбл)', 
                    'Ice Grape (Ледяной Виноград)', 'Gummy Bears (Мармеладные Мишки)', 
                    'Fruit ice (Фруктовый Лёд)', 'Watermelon Astrakhan (Астраханский Арбуз)', 
                    'Royal lemonade (Королевский Лимонад)', 'Grapefruit (Грейпфрут)', 
                    'Raspberry blackberry (Малина Ежевика)', 'Raspberry (Малина)', 
                    'Tangerine Strawberry Lychee (Мандарин Клубника Личи)', 'Sour Cowberry (Кислая Брусника)', 
                    'Pineapple (Ананас)', 'Ice Mango (Ледяное Манго)', 'Watermelon Gum (Арбузная Жвачка)', 
                    'Strawberry Mojito (Клубничный Мохито)', 'Cactus Freestyle (Кактус Фристайл)', 
                    'Wild strawberry (Дикая Клубника)', 'Frosty Mint (Морозная Мята)', 
                    'Passion Fruit (Маракуйя)', 'Chinese Melon (Китайская Дыня)', 
                    'Lemon-Lime (Лимон Лайм)', 'Green Apple (Зеленое Яблоко)', 
                    'Elderberry (Бузина)', 'Double Apple (Двойное Яблоко)', 'Cherry (Вишня)', 
                    'Fruictella (Фруктелла)', 'Skittles (Скиттлс)', 'Asian Mix (Азиатский Микс)'
                ],
                200: [ // 200г - 990₽
                    'Orange Cream (Апельсин-Сливки)', 'Wild Cherry (Дикая Вишня)', 'Cola (Кола)', 
                    'Northern Berries (Северные Ягоды)', 'Orange Dragee (Апельсиновые Драже)',
                    'Raspberry (Малина)', 'Pistachio Ice Cream (Фисташковое Мороженое)', 
                    'Energy Drink & Kiwi (Энергетик с Киви)', 'Mango Yogurt (Манговый Йогурт)',
                    'Lemon Jelly Slices (Лимонные Желейные Дольки)', 'Watermelon Astrakhan (Астраханский Арбуз)', 
                    'Jasmine mochi (Жасминовые Моти)', 'Grapefruit (Грейпфрут)',
                    'Cheese sticks (Сырные Палочки)', 'Poppy Roll (Маковый Рулет)', 
                    'Kiwi apple gooseberry (Киви Яблоко Крыжовник)', 'Cappuccino Marshmallow (Капучино Маршмеллоу)',
                    'Ice mango (Ледяное Манго)', 'Sour jelly (Кислое Желе)', 'Peach-lime (Персик-Лайм)', 
                    'Mango chamomile (Манго Ромашка)', 'White wine (Белое Вино)',
                    'Watermelon Gum (Арбузная Жвачка)', 'Pomelo (Помело)', 'Passion fruit (Маракуйя)', 
                    'Frosty mint (Морозная Мята)', 'Double Apple (Двойное Яблоко)',
                    'Crème de coco (Крем де Коко)', 'Cherry (Вишня)', 'LE Martini Fiero (ЛЕ Мартини Фиеро)', 
                    'Ginger Ale (Имбирный Эль)', 'Kiwano passion fruit (Кивано Маракуйя)',
                    'Grape Drops (Виноградные Леденцы)', 'Strawberry Milkshake (Клубничный Милкшейк)', 
                    'Black Currant Crumble (Черносмородиновый Крамбл)',
                    'Banana Milkshake (Банановый Милкшейк)', 'Ice (Лёд)', 'Fruictella (Фруктелла)', 
                    'Cactus Freestyle (Кактус Фристайл)', 'Gummy bears (Мармеладные Мишки)',
                    'Skittle (Скиттлс)', 'Raspberry rafaella (Малиновая Рафаэлла)', 
                    'Peach apricot (Персик Абрикос)', 'Wild strawberry (Дикая Клубника)',
                    'Raspberry blackberry (Малина Ежевика)', 'Green apple (Зеленое Яблоко)', 
                    'Pear drops (Грушевые Леденцы)', 'Sour cowberry (Кислая Брусника)',
                    'Creamy energy drink (Сливочный Энергетик)', 'Pineapple (Ананас)', 
                    'Chocolate Stout (Шоколадный Стаут)', 'LE Pan Raas STRONG (Пан Раас Крепкий LE)',
                    'LE Pan Raas MEDIUM (Пан Раас Средний LE)', 'Virgin negroni (Виргинский Негрони)', 
                    'Royal lemonade (Королевский Лимонад)', 'Bumble bee (Шмель)',
                    'Bali sunrise (Балийский Рассвет)', 'Strawberry mojito (Клубничный Мохито)', 
                    'Tropic Love (Тропическая Любовь)', 'Pink jam STRONG (Розовое Варенье Крепкое)',
                    'Tangerine Strawberry Lychee (Мандарин Клубника Личи)', 'Passion fruit STRONG (Маракуйя Крепкая)', 
                    'Northern berries STRONG (Северные Ягоды Крепкие)',
                    'Blueberry mint STRONG (Черника с Мятой Крепкая)', 'Pink jam (Розовое Варенье)', 
                    'Ice bonbon (Ледяные Бонбоны)', 'Honey berries (Медовые Ягоды)',
                    'Green soda (Зеленая Газировка)', 'Fruit meringue (Фруктовый Меренг)', 
                    'Fruit ice (Фруктовый Лёд)', 'Cranberries in powdered sugar (Клюква в Сахарной Пудре)',
                    'Rum lady muff (Ромовая Леди Мафф)', 'Pomegranate (Гранат)', 'Milk oolong (Молочный Улун)', 
                    'Lemon lime (Лимон Лайм)', 'Jasmine tea (Жасминовый Чай)',
                    'Ice grape (Ледяной Виноград)', 'Grenadine drops (Гренадиновые Леденцы)', 
                    'Elderberry (Бузина)', 'Chinese melon (Китайская Дыня)',
                    'Cherry cola (Вишневая Кола)', 'Blueberry mint (Черника с Мятой)', 
                    'Black currant (Черная Смородина)', 'Asian mix (Азиатский Микс)',
                    'LE Rock\'n\'Rolla (Рок-н-Ролла LE)', 'Mumbai tea (Мумбай Чай)', 
                    'LE Brandy motors (Бренди Моторс LE)', 'LE Bourbon rocks (Бурбон Рокс LE)', 
                    'LE Agava boom (Агава Бум LE)'
                ]
            },
            // Данные с oshisha.cc/catalog/black-burn/
            'Black Burn': {
                25: [ // 25г - 220₽
                    'Blueberry (Черника)', 'Bananini (Бананини)', 'White Grape (Белый Виноград)',
                    'Gooseberry Shock (Крыжовник Шок)', 'Lime Shock (Лайм Шок)', 'Lemon Waffles (Лимонные Вафли)',
                    'Salak (Салак)', 'Lulo (Луло)', 'Skittles (Скиттлс)', 'Pomelo (Помело)',
                    'Bubble Gum (Жвачка)', 'Pineapple Yogurt (Ананасовый Йогурт)', 'Red Kiwi (Красный Киви)',
                    'Red Energy (Красный Энергетик)', 'Grapefruit (Грейпфрут)', 'Blackcola (Блэккола)',
                    'Red Curant (Красная Смородина)', 'Peach Yogurt (Персиковый Йогурт)', 'Raspberry Shock (Малина Шок)',
                    'Nutella (Нутелла)', 'Feijoa jam (Варенье из Фейхоа)', 'On Chill (На чиле)',
                    'On Relax (На расслабоне)', 'Iceberg (Айсберг)', 'Elka (Елка)', 'Basilik (Базилик)',
                    'Watermelon (Арбуз)', 'Epic Yogurt (Эпик Йогурт)', 'Muesli (Мюсли)', 'Mirinda (Миринда)',
                    'Juicy Smoothie (Сочный Смузи)', 'Etalon Melon (Эталонная Дыня)', 'Summer basket (Летняя Корзина)',
                    'Siberian soda (Сибирская Газировка)', 'Blackberry lemonade (Ежевичный Лимонад)', 'TIK TAK (ТИК ТАК)',
                    'Cheesecake (Чизкейк)', 'Ekzo mango (Экзо Манго)', 'Berry lemonade (Ягодный Лимонад)',
                    'Malibu (Малибу)', 'Creme brule (Крем Брюле)', 'Strawberry coconut (Клубника Кокос)',
                    'Elderberry shock (Бузина Шок)', 'Overdose (Овердоз)', 'SouSep (Соус Сеп)',
                    'Pina colada (Пина Колада)', 'Pear lemonade (Грушевый Лимонад)', 'Ice baby (Ледяной Малыш)',
                    'Real P.F. (Реал П.Ф.)', 'Cranberry shock (Клюква Шок)', 'Peachberry (Персикберри)',
                    'Cane mint (Тростниковая Мята)', 'Sundaysun (Воскресное Солнце)', 'Melon halls (Дыня Холлс)',
                    'Kiwi stoner (Киви Стоунер)', 'Cherry garden (Вишневый Сад)', 'Papaya v obed (Папайя в Обед)',
                    'Chupa graper (Чупа Грейпер)', 'Shock, currant shock (Шок, Смородина Шок)', 'Pineapple (Ананас)',
                    'Haribon (Харибон)', 'Famous apple (Знаменитое Яблоко)', 'Barberry shock (Барбарис Шок)',
                    'Strawberry jam (Клубничное Варенье)', 'Something tropical (Что-то Тропическое)',
                    'Something berry (Что-то Ягодное)', 'Rising star (Восходящая Звезда)', 'Red orange (Красный Апельсин)',
                    'Raspberries (Малина)', 'Peach killer (Персик Киллер)', 'Green tea (Зеленый Чай)',
                    'Garnet (Гранат)', 'Cherry shock (Вишня Шок)', 'Pudding (Пуддинг)',
                    'Tropic Jack (Тропик Джек)', 'Asian lychee (Азиатский Личи)', 'Lemon sweets (Лимонные Конфеты)',
                    'Lemon shock (Лимон Шок)', 'It\'s not black currant (Это не черная смородина)',
                    'Something Icy (Что-то Ледяное)', 'Pistachio ice snow (Фисташковый Ледяной Снег)',
                    'Something sweet (Что-то Сладкое)', 'Irish cream (Ирландские Сливки)',
                    'Almond icecream (Миндальное Мороженое)', 'After 8 (После 8)'
                ],
                100: [ // 100г - 800₽
                    'Blueberry (Черника)', 'Bananini (Бананини)', 'White Grape (Белый Виноград)',
                    'Gooseberry Shock (Крыжовник Шок)', 'Lime Shock (Лайм Шок)', 'Lemon Waffles (Лимонные Вафли)',
                    'Salak (Салак)', 'Lulo (Луло)', 'Skittles (Скиттлс)', 'Pomelo (Помело)',
                    'Pineapple Yogurt (Ананасовый Йогурт)', 'Bubble Gum (Жвачка)', 'Red Kiwi (Красный Киви)',
                    'Red Energy (Красный Энергетик)', 'Grapefruit (Грейпфрут)', 'Blackcola (Блэккола)',
                    'Red currant (Красная Смородина)', 'Iceberg (Айсберг)', 'Feijoa Jam (Варенье из Фейхоа)',
                    'Pudding (Пуддинг)', 'Peach Yogurt (Персиковый Йогурт)', 'Raspberry Shock (Малина Шок)',
                    'On Chill (На чиле)', 'On Relax (На расслабоне)', 'Elka (Елка)', 'Basilik (Базилик)',
                    'Watermelon (Арбуз)', 'Epic Yogurt (Эпик Йогурт)', 'Mirinda (Миринда)', 'Etalon Melon (Эталонная Дыня)',
                    'Summer basket (Летняя Корзина)', 'Siberian soda (Сибирская Газировка)', 'Blackberry lemonade (Ежевичный Лимонад)',
                    'TIK TAK (ТИК ТАК)', 'Cheesecake (Чизкейк)', 'Ekzo mango (Экзо Манго)', 'Berry lemonade (Ягодный Лимонад)',
                    'Creme brule (Крем Брюле)', 'Malibu (Малибу)', 'Strawberry coconut (Клубника Кокос)',
                    'Elderberry shock (Бузина Шок)', 'Overdose (Овердоз)', 'SouSep (Соус Сеп)',
                    'Pina colada (Пина Колада)', 'Pear lemonade (Грушевый Лимонад)', 'Green tea (Зеленый Чай)',
                    'Garnet (Гранат)', 'Famous apple (Знаменитое Яблоко)', 'Lemon sweets (Лимонные Конфеты)',
                    'Black honey (Черный Мед)', 'Sundaysun (Воскресное Солнце)', 'Real P.F. (Реал П.Ф.)',
                    'Cranberry shock (Клюква Шок)', 'Brownie (Брауни)', 'Peach killer (Персик Киллер)',
                    'Pineapple (Ананас)', 'Lemon shock (Лимон Шок)', 'Something tropical (Что-то Тропическое)',
                    'Apple shock (Яблоко Шок)', 'Red orange (Красный Апельсин)', 'Barberry shock (Барбарис Шок)',
                    'Peachberry (Персикберри)', 'Something berry (Что-то Ягодное)', 'Rising star (Восходящая Звезда)',
                    'Cane mint (Тростниковая Мята)', 'Ananas shock (Ананас Шок)', 'Haribon (Харибон)',
                    'Raspberries (Малина)', 'Cherry shock (Вишня Шок)', 'Ice baby (Ледяной Малыш)',
                    'Melon halls (Дыня Холлс)', 'Kiwi stoner (Киви Стоунер)', 'Papaya v obed (Папайя в Обед)',
                    'Shock, currant shock (Шок, Смородина Шок)', 'Chupa graper (Чупа Грейпер)', 'Nutella (Нутелла)',
                    'Muesli (Мюсли)', 'Juicy Smoothie (Сочный Смузи)', 'Tropic Jack (Тропик Джек)',
                    'Something icy (Что-то Ледяное)', 'Irish cream (Ирландские Сливки)', 'Asian lychee (Азиатский Личи)',
                    'After 8 (После 8)', 'Something sweet (Что-то Сладкое)', 'Pistachio ice snow (Фисташковый Ледяной Снег)',
                    'It\'s not black currant (Это не черная смородина)', 'Almond icecream (Миндальное Мороженое)',
                    'Strawberry jam (Клубничное Варенье)', 'Cherry garden (Вишневый Сад)'
                ],
                200: [ // 200г - 1550₽
                    'Blueberry (Черника)', 'Bananini (Бананини)', 'White Grape (Белый Виноград)',
                    'Gooseberry Shock (Крыжовник Шок)', 'Lime Shock (Лайм Шок)', 'Lemon Waffles (Лимонные Вафли)',
                    'Lulo (Луло)', 'Salak (Салак)', 'Skittles (Скиттлс)', 'Pomelo (Помело)',
                    'Pineapple Yogurt (Ананасовый Йогурт)', 'Bubble Gum (Жвачка)', 'Red Kiwi (Красный Киви)',
                    'Red Energy (Красный Энергетик)', 'Grapefruit (Грейпфрут)', 'Red Currant (Красная Смородина)',
                    'Blackcola (Блэккола)', 'Pudding (Пуддинг)', 'Peach Yogurt (Персиковый Йогурт)',
                    'Raspberry Shock (Малина Шок)', 'Nutella (Нутелла)', 'Feijoa jam (Варенье из Фейхоа)',
                    'Iceberg (Айсберг)', 'On Chill (На чиле)', 'On Relax (На расслабоне)', 'Elka (Елка)',
                    'Basilik (Базилик)', 'Watermelon (Арбуз)', 'Epic Yogurt (Эпик Йогурт)', 'Mirinda (Миринда)',
                    'Juicy Smoothie (Сочный Смузи)', 'Etalon Melon (Эталонная Дыня)', 'Summer basket (Летняя Корзина)',
                    'Siberian soda (Сибирская Газировка)', 'Tropic Jack (Тропик Джек)', 'Blackberry lemonade (Ежевичный Лимонад)',
                    'TIK TAK (ТИК ТАК)', 'Cheesecake (Чизкейк)', 'Ekzo mango (Экзо Манго)', 'Berry lemonade (Ягодный Лимонад)',
                    'Malibu (Малибу)', 'Strawberry coconut (Клубника Кокос)', 'Elderberry shock (Бузина Шок)',
                    'SouSep (Соус Сеп)', 'Pina colada (Пина Колада)', 'Pear lemonade (Грушевый Лимонад)',
                    'Asian lychee (Азиатский Личи)', 'Overdose (Овердоз)', 'Real P.F. (Реал П.Ф.)',
                    'Cranberry shock (Клюква Шок)', 'Green tea (Зеленый Чай)', 'Cane mint (Тростниковая Мята)',
                    'Pistachio ice snow (Фисташковый Ледяной Снег)', 'Black honey (Черный Мед)', 'Kiwi stoner (Киви Стоунер)',
                    'Garnet (Гранат)', 'Famous apple (Знаменитое Яблоко)', 'Cherry garden (Вишневый Сад)',
                    'Strawberry jam (Клубничное Варенье)', 'Peachberry (Персикберри)', 'Rising star (Восходящая Звезда)',
                    'Pineapple (Ананас)', 'Cherry shock (Вишня Шок)', 'Barberry shock (Барбарис Шок)',
                    'Shock, currant shock (Шок, Смородина Шок)', 'Haribon (Харибон)', 'Apple shock (Яблоко Шок)',
                    'Something berry (Что-то Ягодное)', 'Red orange (Красный Апельсин)', 'Raspberries (Малина)',
                    'Papaya v obed (Папайя в Обед)', 'Ice baby (Ледяной Малыш)', 'Chupa graper (Чупа Грейпер)',
                    'Peach killer (Персик Киллер)', 'Sundaysun (Воскресное Солнце)', 'Lemon sweets (Лимонные Конфеты)',
                    'Brownie (Брауни)', 'Melon halls (Дыня Холлс)', 'Lemon shock (Лимон Шок)',
                    'Something tropical (Что-то Тропическое)', 'Ananas shock (Ананас Шок)', 'Muesli (Мюсли)',
                    'Creme brule (Крем Брюле)', 'Almond icecream (Миндальное Мороженое)', 'Something icy (Что-то Ледяное)',
                    'Something sweet (Что-то Сладкое)', 'Irish cream (Ирландские Сливки)', 'After 8 (После 8)',
                    'It\'s not black currant (Это не черная смородина)'
                ]
            },
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
            // Данные с oshisha.cc/catalog/bonche/
            'Bonche': {
                30: [ // 30г - 680₽
                    'New Year 2026 (Новый Год 2026)', 'Irga (Ирга)', 'Singapore Sling (Сингапур Слинг)',
                    'Mint Julep (Мятный Джулеп)', 'Gimlet (Джимлет)', 'Clover Club (Клевер Клаб)',
                    'Pear (Груша)', 'Kiwi (Киви)', 'Sesame (Кунжут)', 'Black Currant (Черная Смородина)',
                    'Prunes (Чернослив)', 'Red Wine (Красное Вино)', 'Peanut (Арахис)', 'Orange (Апельсин)',
                    'Blueberry (Черника)', 'Brownie (Брауни)', 'Cognac (Коньяк)', 'Grapefruit (Грейпфрут)',
                    'Caramel (Карамель)', 'Bergamot (Бергамот)', 'Wild Strawberry (Дикая Земляника)',
                    'Coffee (Кофе)', 'Coconut (Кокос)', 'Mango (Манго)', 'Melissa (Мелисса)',
                    'Lavender (Лаванда)', 'Marzipan (Марципан)', 'Whiskey (Виски)', 'Vanilla (Ваниль)',
                    'Lemongrass (Лемонграсс)', 'Honey (Мёд)', 'Ginger (Имбирь)', 'Clove (Гвоздика)',
                    'Basil (Базилик)', 'Sweet corn (Кукуруза)', 'Strawberry (Клубника)', 'Salami (Салями)',
                    'Rum (Ром)', 'Raspberry (Малина)', 'Pomegranate (Гранат)', 'Pineapple (Ананас)',
                    'Passion fruit (Маракуйя)', 'Olive (Оливки)', 'Lychee (Личи)', 'Lemon (Лимон)',
                    'Dark chocolate (Темный шоколад)', 'Cookie (Печенье)', 'Cherry (Вишня)', 'Cheesecake (Чизкейк)',
                    'Base (Табачный)', 'Barberry (Барбарис)', 'Smena (Смена)', 'New Year 2025 (Новый Год 2025)'
                ],
                60: [ // 60г - 1120₽
                    'Vanilla (Ваниль)', 'Lavender (Лаванда)', 'Caramel (Карамель)', 'Black Currant (Черная Смородина)',
                    'New Year 2026 (Новый Год 2026)', 'Singapore Sling (Сингапур Слинг)', 'Irga (Ирга)',
                    'Mint Julep (Мятный Джулеп)', 'Gimlet (Джимлет)', 'Clover Club (Клевер Клаб)',
                    'Pear (Груша)', 'Kiwi (Киви)', 'Sesame (Кунжут)', 'Prunes (Чернослив)',
                    'Red Wine (Красное Вино)', 'Peanut (Арахис)', 'Orange (Апельсин)', 'Blueberry (Черника)',
                    'Brownie (Брауни)', 'Cognac (Коньяк)', 'Grapefruit (Грейпфрут)', 'Wild Strawberry (Дикая Земляника)',
                    'Coffee (Кофе)', 'Coconut (Кокос)', 'Whiskey (Виски)', 'Sweet corn (Кукуруза)',
                    'Strawberry (Клубника)', 'Salami (Салями)', 'Rum (Ром)', 'Raspberry (Малина)',
                    'Pomegranate (Гранат)', 'Pineapple (Ананас)', 'Passion fruit (Маракуйя)', 'Olive (Оливки)',
                    'Marzipan (Марципан)', 'Mango (Манго)', 'Lychee (Личи)', 'Lemon (Лимон)',
                    'Dark chocolate (Темный шоколад)', 'Cookie (Печенье)', 'Cherry (Вишня)', 'Cheesecake (Чизкейк)',
                    'Base (Табачный)', 'Barberry (Барбарис)', 'New Year 2025 (Новый Год 2025)'
                ],
                120: [ // 120г - 1900₽
                    'Singapore Sling (Сингапур Слинг)', 'New Year 2026 (Новый Год 2026)', 'Irga (Ирга)',
                    'Mint Julep (Мятный Джулеп)', 'Gimlet (Джимлет)', 'Clover Club (Клевер Клаб)',
                    'Pear (Груша)', 'Kiwi (Киви)', 'Sesame (Кунжут)', 'Black Currant (Черная Смородина)',
                    'Prunes (Чернослив)', 'Red Wine (Красное Вино)', 'Peanut (Арахис)', 'Orange (Апельсин)',
                    'Blueberry (Черника)', 'Brownie (Брауни)', 'Cognac (Коньяк)', 'Grapefruit (Грейпфрут)',
                    'Caramel (Карамель)', 'Bergamot (Бергамот)', 'Vanilla (Ваниль)', 'Melissa (Мелисса)',
                    'Lemongrass (Лемонграсс)', 'Lavender (Лаванда)', 'Honey (Мёд)', 'Ginger (Имбирь)',
                    'Clove (Гвоздика)', 'Basil (Базилик)', 'Wild Strawberry (Дикая Земляника)', 'Coffee (Кофе)',
                    'Coconut (Кокос)', 'Whiskey (Виски)', 'Sweet corn (Кукуруза)', 'Strawberry (Клубника)',
                    'Salami (Салями)', 'Rum (Ром)', 'Raspberry (Малина)', 'Pomegranate (Гранат)',
                    'Pineapple (Ананас)', 'Passion fruit (Маракуйя)', 'Olive (Оливки)', 'Marzipan (Марципан)',
                    'Mango (Манго)', 'Lychee (Личи)', 'Lemon (Лимон)', 'Dark chocolate (Темный шоколад)',
                    'Cookie (Печенье)', 'Cherry (Вишня)', 'Cheesecake (Чизкейк)', 'Base (Табачный)',
                    'Barberry (Барбарис)', 'Smena (Смена)', 'New Year 2025 (Новый Год 2025)', 'Hoob (Hoob)'
                ]
            },
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
            // Данные с oshisha.cc/catalog/bliss/
            'BLISS': {
                40: [ // 40г - 310₽
                    'Cream (Сливочный Крем)', 'Cola (Кола)', 'Coconut (Кокос)',
                    'Strawberry Mille-feuille (Клубничный милфей)', 'Belgian Waffles (Бельгийские Вафли)',
                    'Kiwi (Киви)', 'Mango Chamomile (Манго ромашка)', 'Basil (Базилик)',
                    'Sour Elderberry (Кислая бузина)', 'Lime (Лайм)', 'Sour Currant (Кислая смородина)',
                    'Red Grape (Красный виноград)', 'Peach Yogurt (Персик Йогурт)', 'Watermelon Gum (Арбузная жвачка)',
                    'Conifer (Хвоя)', 'Super Ice (Super Ice (холодок))', 'Lemon (Лимон)',
                    'Strawberry (Клубника)', 'Raspberry Cola (Малиновая Кола)', 'Limoncello (Лимончелло)',
                    'Mango (Манго)', 'Berry Smoothie (Ягодный смузи)', 'Blueberry Sorbet (Черничный сорбет)',
                    'Tropical Smoothie (Тропический смузи)', 'Raspberry (Малина)', 'Melon (Дыня)',
                    'Pink shot (Pink shot (Грейпфрут, клубника, малина))', 'Orange (Апельсин)'
                ],
                100: [ // 100г - 745₽
                    'Cola (Кола)', 'Coconut (Кокос)', 'Strawberry Mille-feuille (Клубничный милфей)',
                    'Belgian Waffles (Бельгийские Вафли)', 'Mango Chamomile (Манго ромашка)', 'Kiwi (Киви)',
                    'Basil (Базилик)', 'Sour Elderberry (Кислая бузина)', 'Lime (Лайм)',
                    'Red Grape (Красный виноград)', 'Sour Currant (Кислая смородина)',
                    'Pink shot (Pink shot (Грейпфрут, клубника, малина))', 'Peach Yogurt (Персик Йогурт)',
                    'Conifer (Хвоя)', 'Watermelon Gum (Арбузная жвачка)', 'Orange (Апельсин)',
                    'Super Ice (Super Ice (холодок))', 'Strawberry (Клубника)', 'Lemon (Лимон)',
                    'Raspberry Cola (Малиновая Кола)', 'Limoncello (Лимончелло)', 'Berry Smoothie (Ягодный смузи)',
                    'Blueberry Sorbet (Черничный сорбет)', 'Raspberry (Малина)', 'Mango (Манго)',
                    'Melon (Дыня)', 'Cream (Сливочный Крем)', 'Tropical Smoothie (Тропический смузи)'
                ],
                250: [ // 250г - 1550₽
                    'Cream (Сливочный Крем)', 'Cola (Кола)', 'Strawberry Mille-feuille (Клубничный милфей)',
                    'Belgian Waffles (Бельгийские Вафли)', 'Mango Chamomile (Манго ромашка)', 'Kiwi (Киви)',
                    'Basil (Базилик)', 'Sour Elderberry (Кислая бузина)', 'Lime (Лайм)',
                    'Sour Currant (Кислая смородина)', 'Pink shot (Pink shot (Грейпфрут, клубника, малина))',
                    'Peach Yogurt (Персик Йогурт)', 'Conifer (Хвоя)', 'Watermelon Gum (Арбузная жвачка)',
                    'Super Ice (Super Ice (холодок))', 'Strawberry (Клубника)', 'Lemon (Лимон)',
                    'Raspberry Cola (Малиновая Кола)', 'Limoncello (Лимончелло)', 'Berry Smoothie (Ягодный смузи)',
                    'Blueberry Sorbet (Черничный сорбет)', 'Raspberry (Малина)', 'Mango (Манго)',
                    'Melon (Дыня)', 'Red Grape (Красный виноград)', 'Coconut (Кокос)',
                    'Orange (Апельсин)', 'Tropical Smoothie (Тропический смузи)'
                ]
            },
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
            'CHABACCO': [
                { price: 220, weight: 40 },  // 40г-220₽ (с oshisha.cc)
                { price: 990, weight: 200 }  // 200г-990₽ (с oshisha.cc)
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
                { price: 680, weight: 30 },  // 30г-680₽ (с oshisha.cc)
                { price: 1120, weight: 60 }, // 60г-1120₽ (с oshisha.cc)
                { price: 1900, weight: 120 }  // 120г-1900₽ (с oshisha.cc)
            ],
            'Black Burn': [
                { price: 220, weight: 25 },  // 25г-220₽ (с oshisha.cc)
                { price: 800, weight: 100 },  // 100г-800₽ (с oshisha.cc)
                { price: 1550, weight: 200 }  // 200г-1550₽ (с oshisha.cc)
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
                { price: 310, weight: 40 },  // 40г-310₽ (с oshisha.cc)
                { price: 745, weight: 100 }, // 100г-745₽ (с oshisha.cc)
                { price: 1550, weight: 250 }  // 250г-1550₽ (с oshisha.cc)
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
        await this.loadShelfRating();
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

    async loadShelfRating() {
        const result = await apiService.loadShelfRating();
        if (result.success) {
            this.shelfRatingTobaccos = result.data;
            console.log('Загружено табаков для оценки полки:', this.shelfRatingTobaccos.length);
        } else {
            this.shelfRatingTobaccos = [];
        }
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
            this.showOcrForm = false; // Закрываем OCR форму
            // Инициализируем с одним брендом, если список пуст
            if (this.multiBrands.length === 0) {
                this.addNewBrand();
            }
        }
        this.render();
    }

    toggleOcrForm() {
        this.showOcrForm = !this.showOcrForm;
        if (this.showOcrForm) {
            this.showMultiBrandForm = false; // Закрываем форму множественного добавления
            this.ocrPreview = null; // Сбрасываем превью
        }
        this.render();
    }

    addNewBrand() {
        this.multiBrands.push({
            brandName: '',
            price: null, // Цена не устанавливается до выбора бренда
            weight: null, // Вес не устанавливается до выбора бренда
            orderDate: new Date().toISOString().split('T')[0],
            tastes: [],
            priceCategories: [] // Для хранения нескольких ценовых категорий
        });
        this.render();
    }

    // Добавить ценовую категорию к существующему бренду
    addPriceCategory(brandIndex) {
        const brand = this.multiBrands[brandIndex];
        if (!brand.brandName) {
            alert('Сначала выберите бренд');
            return;
        }
        if (!brand.price || !brand.weight) {
            alert('Сначала выберите цену и вес для текущей категории');
            return;
        }
        
        // Сохраняем текущие вкусы в категорию
        if (brand.tastes.length > 0) {
            brand.priceCategories.push({
                price: brand.price,
                weight: brand.weight,
                tastes: [...brand.tastes]
            });
            
            // Сбрасываем текущие поля для новой категории
            brand.price = null;
            brand.weight = null;
            brand.tastes = [];
            
            this.render();
        } else {
            alert('Добавьте хотя бы один вкус в текущую категорию');
        }
    }

    // Получить доступные вкусы для выбранного веса/цены
    getAvailableTastes(brandName, weight) {
        const brandData = this.brandTasteMapping[brandName];
        if (!brandData || typeof brandData !== 'object') {
            // Если структура не объект с весами, возвращаем все вкусы
            return Array.isArray(brandData) ? brandData : this.tasteSuggestions;
        }
        
        // Возвращаем вкусы для конкретного веса
        return brandData[weight] || [];
    }

    removeBrand(index) {
        this.multiBrands.splice(index, 1);
        this.render();
    }

    updateBrand(index, field, value) {
        if (this.multiBrands[index]) {
            const oldBrandName = this.multiBrands[index].brandName;
            
            // Если меняется бренд, сбрасываем цену, вес и вкусы
            if (field === 'brandName' && oldBrandName && oldBrandName !== value) {
                this.multiBrands[index].price = null;
                this.multiBrands[index].weight = null;
                this.multiBrands[index].tastes = [];
            }
            
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
            // Закрываем формы и очищаем данные
            this.showMultiBrandForm = false;
            this.showOcrForm = false;
            this.multiBrands = [];
            this.ocrPreview = null;
            this.ocrParsedData = [];
            
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

        // Подготовка данных с учетом сохраненных ценовых категорий
        const brandsToSend = [];
        
        for (const brand of this.multiBrands) {
            if (!brand.brandName || brand.brandName.trim() === '') {
                alert('Пожалуйста, введите название бренда');
                return;
            }
            
            // Добавляем текущую категорию, если есть вкусы
            if (brand.tastes.length > 0 && brand.price && brand.weight) {
                brandsToSend.push({
                    brandName: brand.brandName,
                    price: brand.price,
                    weight: brand.weight,
                    orderDate: brand.orderDate,
                    tastes: brand.tastes
                });
            }
            
            // Добавляем сохраненные ценовые категории
            if (brand.priceCategories && brand.priceCategories.length > 0) {
                for (const category of brand.priceCategories) {
                    brandsToSend.push({
                        brandName: brand.brandName,
                        price: category.price,
                        weight: category.weight,
                        orderDate: brand.orderDate,
                        tastes: category.tastes
                    });
                }
            }
        }

        // Валидация
        if (brandsToSend.length === 0) {
            alert('Добавьте хотя бы один бренд с вкусами');
                return;
        }

        // Показываем индикатор загрузки
        const saveButton = document.querySelector('.save-button');
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Сохранение...';
        saveButton.disabled = true;

        const result = await apiService.addMultiBrandTobaccos(this.currentDelivery.id, brandsToSend);
        
        if (result.success) {
            // Сохраняем количество добавленных табаков перед очисткой
            const addedCount = brandsToSend.reduce((total, brand) => total + brand.tastes.length, 0);
            
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

    async handleOcrRecognize() {
        const invoicePhotoInput = document.getElementById('invoicePhoto');
        
        if (!invoicePhotoInput.files || invoicePhotoInput.files.length === 0) {
            this.showNotification('Пожалуйста, загрузите фото накладной', 'error');
            return;
        }
        
        const invoicePhoto = invoicePhotoInput.files[0];
        
        // Показываем индикатор загрузки
        this.showNotification('Обработка накладной... Это может занять некоторое время', 'info');
        
        try {
            const result = await apiService.parseInvoicePhoto(invoicePhoto);
            
            if (result.success && result.data.recognizedTobaccos) {
                this.ocrPreview = result.data.recognizedTobaccos;
                
                // Парсим результаты и автоматически подставляем цены
                this.ocrParsedData = this.parseInvoicePositionsAndSetPrices(this.ocrPreview);
                
                this.showNotification(`Распознано ${this.ocrParsedData.length} позиций! Проверьте данные перед добавлением.`, 'success');
                this.render();
            } else {
                this.showNotification('Ошибка при распознавании: ' + (result.error || 'Неизвестная ошибка'), 'error');
            }
        } catch (error) {
            this.showNotification('Ошибка при обработке накладной: ' + error.message, 'error');
        }
    }
    
    /**
     * Парсит позиции из накладной и автоматически подставляет цены из brandPriceWeightMapping
     * Формат: "БРЕНД - Вкус вес количество"
     */
    parseInvoicePositionsAndSetPrices(recognizedPositions) {
        const parsed = [];
        
        for (const positionStr of recognizedPositions) {
            // Парсим строку формата "БРЕНД - Вкус вес количество"
            const parts = positionStr.split(' - ');
            let brand = '';
            let taste = '';
            let weight = null;
            let quantity = 1; // По умолчанию 1 пачка
            let price = null;
            
            if (parts.length >= 2) {
                brand = parts[0].trim();
                const rest = parts[1].trim();
                
                // Извлекаем вес (число + г/гр)
                const weightMatch = rest.match(/(\d+)\s*(?:г|гр|g)/i);
                if (weightMatch) {
                    weight = parseInt(weightMatch[1]);
                }
                
                // Извлекаем количество (число + шт/пачек)
                const quantityMatch = rest.match(/(\d+)\s*(?:шт|пачек?|pcs)/i);
                if (quantityMatch) {
                    quantity = parseInt(quantityMatch[1]);
                }
                
                // Убираем вес и количество из строки вкуса
                let tasteStr = rest.replace(/\d+\s*(?:г|гр|g)/gi, '')
                                   .replace(/\d+\s*(?:шт|пачек?|pcs)/gi, '')
                                   .trim();
                taste = tasteStr;
            } else {
                // Если нет разделителя " - ", пробуем найти бренд в начале
                const words = positionStr.split(/\s+/);
                if (words.length > 0) {
                    brand = words[0];
                    const rest = words.slice(1).join(' ');
                    const weightMatch = rest.match(/(\d+)\s*(?:г|гр|g)/i);
                    if (weightMatch) {
                        weight = parseInt(weightMatch[1]);
                    }
                    const quantityMatch = rest.match(/(\d+)\s*(?:шт|пачек?|pcs)/i);
                    if (quantityMatch) {
                        quantity = parseInt(quantityMatch[1]);
                    }
                    taste = rest.replace(/\d+\s*(?:г|гр|g)/gi, '')
                                .replace(/\d+\s*(?:шт|пачек?|pcs)/gi, '')
                                .trim();
                }
            }
            
            // Автоматически подставляем цену из brandPriceWeightMapping
            if (brand && weight) {
                const brandMapping = this.brandPriceWeightMapping[brand];
                if (brandMapping) {
                    // Ищем точное совпадение веса
                    const priceEntry = brandMapping.find(entry => entry.weight === weight);
                    if (priceEntry) {
                        price = priceEntry.price;
                    } else {
                        // Ищем ближайший вес
                        const sorted = brandMapping.sort((a, b) => Math.abs(a.weight - weight) - Math.abs(b.weight - weight));
                        if (sorted.length > 0) {
                            price = sorted[0].price;
                        }
                    }
                }
            }
            
            parsed.push({
                brand: brand,
                taste: taste,
                weight: weight,
                quantity: quantity,
                price: price,
                originalText: positionStr
            });
        }
        
        return parsed;
    }

    updateOcrTobacco(index, field, value) {
        if (this.ocrParsedData && this.ocrParsedData[index]) {
            this.ocrParsedData[index][field] = value;
            
            // Если изменился бренд или вес, автоматически обновляем цену
            if (field === 'brand' || field === 'weight') {
                const tobacco = this.ocrParsedData[index];
                if (tobacco.brand && tobacco.weight) {
                    const brandMapping = this.brandPriceWeightMapping[tobacco.brand];
                    if (brandMapping) {
                        const priceEntry = brandMapping.find(entry => entry.weight === tobacco.weight);
                        if (priceEntry) {
                            tobacco.price = priceEntry.price;
                        } else {
                            // Ищем ближайший вес
                            const sorted = brandMapping.sort((a, b) => Math.abs(a.weight - tobacco.weight) - Math.abs(b.weight - tobacco.weight));
                            if (sorted.length > 0) {
                                tobacco.price = sorted[0].price;
                            }
                        }
                    }
                }
            }
            
            this.render();
        }
    }

    async handleOcrAddTobaccos() {
        if (!this.ocrParsedData || this.ocrParsedData.length === 0) {
            this.showNotification('Нет данных для добавления. Сначала распознайте табаки.', 'error');
            return;
        }
        
        // Валидация данных
        for (let i = 0; i < this.ocrParsedData.length; i++) {
            const tobacco = this.ocrParsedData[i];
            if (!tobacco.brand || !tobacco.taste || !tobacco.weight || !tobacco.price) {
                this.showNotification(`Заполните все поля для табака ${i + 1}`, 'error');
                return;
            }
        }
        
        // Если нет текущего привоза, создаем его
        if (!this.currentDelivery) {
            const createResult = await apiService.createNewDelivery(this.currentUser.username);
            if (createResult.success) {
                this.currentDelivery = createResult.data;
            } else {
                this.showNotification('Ошибка создания привоза: ' + createResult.error, 'error');
                return;
            }
        }
        
        // Группируем табаки по бренду, цене и весу
        // Учитываем количество пачек - добавляем вкус quantity раз
        const brandsMap = new Map();
        
        for (const tobacco of this.ocrParsedData) {
            const key = `${tobacco.brand}_${tobacco.price}_${tobacco.weight}`;
            if (!brandsMap.has(key)) {
                brandsMap.set(key, {
                    brandName: tobacco.brand,
                    price: tobacco.price,
                    weight: tobacco.weight,
                    orderDate: new Date().toISOString().split('T')[0],
                    tastes: []
                });
            }
            // Добавляем вкус quantity раз (для каждой пачки)
            const quantity = tobacco.quantity || 1;
            for (let i = 0; i < quantity; i++) {
                brandsMap.get(key).tastes.push(tobacco.taste);
            }
        }
        
        const brandsToSend = Array.from(brandsMap.values());
        
        // Показываем индикатор загрузки
        this.showNotification('Добавление табаков в привоз...', 'info');
        
        try {
            const result = await apiService.addMultiBrandTobaccos(this.currentDelivery.id, brandsToSend);
            
            if (result.success) {
                // Сохраняем количество перед очисткой
                const addedCount = this.ocrParsedData.reduce((sum, item) => sum + (item.quantity || 1), 0);
                
                // Обновляем данные
                await this.loadTobaccos();
                await this.loadCurrentDelivery();
                
                // Закрываем форму и очищаем данные
                this.showOcrForm = false;
                this.ocrPreview = null;
                this.ocrParsedData = [];
                const invoicePhotoInput = document.getElementById('invoicePhoto');
                if (invoicePhotoInput) invoicePhotoInput.value = '';
                
                this.render();
                this.showNotification(`Успешно добавлено ${addedCount} табаков в привоз!`, 'success');
            } else {
                this.showNotification('Ошибка при добавлении табаков: ' + result.error, 'error');
            }
        } catch (error) {
            this.showNotification('Ошибка при обработке: ' + error.message, 'error');
        }
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


    // Функции для работы с рекомендациями
    selectBrandSuggestion(brandIndex, brandName) {
        const currentBrand = this.multiBrands[brandIndex];
        // Если бренд действительно меняется, сбрасываем цену, вес и вкусы
        if (currentBrand && currentBrand.brandName !== brandName) {
            this.updateBrand(brandIndex, 'brandName', brandName);
            // Сбрасываем цену, вес и вкусы при смене бренда
            this.updateBrand(brandIndex, 'price', null);
            this.updateBrand(brandIndex, 'weight', null);
            this.updateBrandTastes(brandIndex, '');
        } else {
        this.updateBrand(brandIndex, 'brandName', brandName);
        }
    }

    selectTasteSuggestion(brandIndex, taste) {
        const currentTastes = this.multiBrands[brandIndex].tastes;
        // Добавляем вкус каждый раз при нажатии (убираем проверку на дубликаты)
        currentTastes.push(taste);
        this.updateBrandTastes(brandIndex, currentTastes.join(', '));
    }

    selectTasteSuggestionFromElement(element, brandIndex) {
        const taste = element.getAttribute('data-taste');
        if (taste) {
            // Декодируем HTML-сущности обратно в обычный текст
            const decodedTaste = taste.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            this.selectTasteSuggestion(brandIndex, decodedTaste);
        }
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
                                <span>Выйти</span>
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
                    <button class="tab-button ${this.activeTab === 'shelf-rating' ? 'active' : ''}" onclick="app.switchTab('shelf-rating')">
                        Оценка полки
                    </button>
                </div>

                <div class="tab-content">
                    ${this.activeTab === 'current' ? uiRenderer.renderCurrentTab(this) : 
                      this.activeTab === 'history' ? uiRenderer.renderHistoryTab(this) :
                      uiRenderer.renderShelfRatingTab(this)}
                </div>
            </div>
            
            ${this.showDeliveryModal ? uiRenderer.renderDeliveryModal(this) : ''}
        `;
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
