// UI модуль для рендеринга интерфейса
class UIRenderer {
    constructor() {}

    // Рендеринг формы авторизации
    renderLoginForm() {
        return `
            <div class="app">
                <div class="header">
                    <div class="header-content">
                        <div class="header-center">
                            <h1>Hookah Staff</h1>
                            <p>Управление табаками для кальянной</p>
                        </div>
                    </div>
                </div>
                
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-header">
                            <div class="login-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h2>Вход в систему</h2>
                            <p>Войдите в свой аккаунт для доступа к системе</p>
                        </div>
                        
                        <div class="login-form">
                            <div class="form-group">
                                <label>Имя пользователя</label>
                                <input type="text" id="username" placeholder="Введите имя пользователя" class="form-input">
                            </div>
                            
                            <div class="form-group">
                                <label>Пароль</label>
                                <input type="password" id="password" placeholder="Введите пароль" class="form-input">
                            </div>
                            
                            <button onclick="app.handleLogin()" class="login-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                                </svg>
                                Войти в систему
                            </button>
                        </div>
                        
                        <div class="login-info">
                            <div class="info-header">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                </svg>
                                Тестовые пользователи
                            </div>
                            <div class="info-content">
                                <div class="user-role">
                                    <span class="role-name">Кальянный мастер:</span>
                                    <span class="role-credentials">master / master123</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Рендеринг текущей вкладки
    renderCurrentTab(app) {
        return `
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${app.tobaccos.length}</div>
                    <div class="stat-label">Табаков в текущем привозе</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        ${app.tobaccos.length > 0 ? Math.round(app.tobaccos.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0)) : 0}
                    </div>
                    <div class="stat-label">Стоимость привоза (₽)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${app.currentDelivery ? 'Активен' : 'Нет'}</div>
                    <div class="stat-label">Статус привоза</div>
                </div>
            </div>

            ${this.renderHookahMasterControls(app)}

            ${app.showMultiBrandForm ? this.renderMultiBrandForm(app) : ''}

            <div class="tobacco-list">
                <div class="tobacco-table">
                    <div class="table-header">
                        <h3>Текущий привоз</h3>
                    </div>
                    ${this.renderTobaccoTable(app)}
                </div>
            </div>
        `;
    }

    // Рендеринг истории привозов
    renderHistoryTab(app) {
        return `
            <div class="history-container">
                <h2 style="text-align: center; margin-bottom: 30px; color: #495057;">История привозов</h2>
                
                ${app.finalizedDeliveries.length === 0 ? `
                    <div class="empty-state">
                        <p>Нет завершенных привозов</p>
                        <p>Завершите первый привоз, чтобы увидеть его здесь</p>
                    </div>
                ` : `
                    <div class="delivery-cards">
                        ${app.finalizedDeliveries.map(delivery => `
                            <div class="delivery-card" onclick="app.showDeliveryDetails(${delivery.id})">
                                <div class="delivery-date">
                                    ${new Date(delivery.deliveryDate).toLocaleDateString('ru-RU')}
                                </div>
                                <div class="delivery-info">
                                    <div>Создан: ${delivery.createdBy}</div>
                                    <div>Завершен: ${new Date(delivery.finalizedAt).toLocaleDateString('ru-RU')}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }

    // Рендеринг вкладки "Оценка полки"
    renderShelfRatingTab(app) {
        return `
            <div class="tobacco-list">
                <div class="tobacco-table">
                    <div class="table-header">
                        <h3>Оценка полки - Все табаки</h3>
                    </div>
                    ${app.shelfRatingTobaccos.length === 0 ? `
                        <div class="empty-state">
                            <p>Нет данных</p>
                            <p>Добавьте и завершите привоз, чтобы увидеть оценку полки</p>
                        </div>
                    ` : `
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Бренд</th>
                                    <th>Вкус</th>
                                    <th>Оценка актуальности</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${app.shelfRatingTobaccos.map(tobacco => `
                                    <tr>
                                        <td>${tobacco.brand_name}</td>
                                        <td>${tobacco.taste}</td>
                                        <td>
                                            <span style="font-weight: 600; color: ${this.getRelevanceColor(tobacco.relevanceScore)};">
                                                ${tobacco.relevanceScore || '1.0'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        `;
    }

    // Получить цвет для оценки актуальности
    getRelevanceColor(score) {
        const scoreValue = parseFloat(score) || 1.0;
        if (scoreValue >= 4.5) return '#28a745'; // Зеленый
        if (scoreValue >= 3.5) return '#20c997'; // Сине-зеленый
        if (scoreValue >= 2.5) return '#ffc107'; // Желтый
        if (scoreValue >= 1.5) return '#fd7e14'; // Оранжевый
        return '#dc3545'; // Красный
    }

    // Рендеринг контролов для кальянного мастера
    renderHookahMasterControls(app) {
        return `
            <div class="delivery-controls" style="margin-bottom: 30px; text-align: center;">
                ${!app.currentDelivery ? `
                    <button class="add-button" onclick="app.createNewDeliveryWithForm()">
                        Создать новый привоз
                    </button>
                ` : `
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="add-button" onclick="app.toggleMultiBrandForm()">
                            ${app.showMultiBrandForm ? 'Отмена' : 'Добавить табаки'}
                        </button>
                        <button class="add-button" onclick="app.finalizeDelivery()" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                            Зафиксировать привоз
                        </button>
                        <button class="add-button" onclick="app.cancelDelivery()" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                            Отменить привоз
                        </button>
                    </div>
                `}
            </div>
        `;
    }


    // Рендеринг формы множественного добавления табаков
    renderMultiBrandForm(app) {
        return `
            <div class="add-form">
                <h3>Добавить табаки</h3>
                <div class="brands-container">
                    ${app.multiBrands.map((brand, index) => `
                        <div class="brand-form" style="border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: #f8f9fa;">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
                                <h4 style="margin: 0; color: #495057;">Бренд ${index + 1}</h4>
                                ${app.multiBrands.length > 1 ? `
                                    <button type="button" onclick="app.removeBrand(${index})" 
                                            style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">
                                        Удалить бренд
                                    </button>
                                ` : ''}
                            </div>
                            
                            <div class="form-group">
                                <label>Название бренда:</label>
                                <input
                                    type="text"
                                    value="${brand.brandName}"
                                    onchange="app.updateBrand(${index}, 'brandName', this.value)"
                                    placeholder="Например: Darkside"
                                />
                                ${this.renderSuggestions(app.brandSuggestions, 'brand', index)}
                            </div>
                            
                            <div class="form-group">
                                <label>Крепость: ${brand.fortress}/5</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value="${brand.fortress}"
                                    onchange="app.updateBrand(${index}, 'fortress', parseInt(this.value))"
                                />
                                <span class="fortress-text">${utils.getFortressText(brand.fortress)}</span>
                            </div>
                            
                            <div class="form-group">
                                <label>Цена за пачку (₽):</label>
                                <input
                                    type="number"
                                    value="${brand.price}"
                                    onchange="app.updateBrand(${index}, 'price', parseFloat(this.value) || 0)"
                                    placeholder="1200"
                                />
                                ${this.renderSuggestions(app.priceSuggestions, 'price', index)}
                            </div>
                            
                            <div class="form-group">
                                <label>Вес пачки (г):</label>
                                <input
                                    type="number"
                                    value="${brand.weight}"
                                    onchange="app.updateBrand(${index}, 'weight', parseInt(this.value) || 50)"
                                    placeholder="50"
                                    readonly
                                    style="background-color: #f8f9fa; color: #6c757d;"
                                />
                                <small style="color: #6c757d; font-size: 0.8rem;">Вес автоматически устанавливается при выборе цены</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Вкусы (через запятую):</label>
                                <textarea
                                    rows="3"
                                    placeholder="Малина, Смородина, Клубника"
                                    onchange="app.updateBrandTastes(${index}, this.value)"
                                    style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 6px; resize: vertical;"
                                >${brand.tastes.join(', ')}</textarea>
                                <small style="color: #6c757d; font-size: 0.8rem; display: block; margin-top: 5px;">
                                    💡 Можно нажимать на один вкус несколько раз для добавления нескольких пачек
                                </small>
                                ${this.renderSuggestions(app.tasteSuggestions, 'taste', index)}
                            </div>
                            
                            <div class="form-group">
                                <label>Предварительный просмотр:</label>
                                <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e9ecef;">
                                    ${brand.tastes.length > 0 ? 
                                        (() => {
                                            const tasteCounts = app.getTasteCounts(brand.tastes);
                                            return Object.entries(tasteCounts).map(([taste, count]) => `
                                                <div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                                                    <div>
                                                        <strong>${brand.brandName || 'Бренд'}</strong> - ${taste.trim()} ${count > 1 ? `(${count} шт.)` : ''}
                                                        <br><small>Крепость: ${utils.getFortressText(brand.fortress)}, Цена: ${brand.price || 0} ₽, Вес: ${brand.weight || 50} г</small>
                                                    </div>
                                                    <button type="button" onclick="app.removeTasteSuggestion(${index}, '${taste}')" 
                                                            style="background: #dc3545; color: white; border: none; border-radius: 3px; padding: 2px 6px; font-size: 0.7rem; cursor: pointer; margin-left: 10px;">
                                                        ×
                                                    </button>
                                                </div>
                                            `).join('');
                                        })() : 
                                        '<div style="color: #6c757d; font-style: italic;">Введите вкусы для предварительного просмотра</div>'
                                    }
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <button type="button" onclick="app.addNewBrand()" 
                            style="background: #28a745; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer;">
                        + Добавить еще один бренд
                    </button>
                </div>
                
                <div class="form-group">
                    <label>Общий предварительный просмотр:</label>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; max-height: 300px; overflow-y: auto;">
                        ${app.multiBrands.some(brand => brand.tastes.length > 0) ? 
                            app.multiBrands.map((brand, brandIndex) => 
                                brand.tastes.length > 0 ? `
                                    <div style="margin-bottom: 15px;">
                                        <h5 style="margin: 0 0 10px 0; color: #495057;">${brand.brandName || `Бренд ${brandIndex + 1}`}</h5>
                                        ${(() => {
                                            const tasteCounts = app.getTasteCounts(brand.tastes);
                                            return Object.entries(tasteCounts).map(([taste, count]) => `
                                                <div style="margin: 5px 0; padding: 8px; background: white; border-radius: 4px; border: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                                                    <div>
                                                        <strong>${taste.trim()}</strong> ${count > 1 ? `(${count} шт.)` : ''}
                                                        <br><small>Крепость: ${utils.getFortressText(brand.fortress)}, Цена: ${brand.price || 0} ₽, Вес: ${brand.weight || 50} г</small>
                                                    </div>
                                                    <button type="button" onclick="app.removeTasteSuggestion(${brandIndex}, '${taste}')" 
                                                            style="background: #dc3545; color: white; border: none; border-radius: 3px; padding: 2px 6px; font-size: 0.7rem; cursor: pointer; margin-left: 10px;">
                                                        ×
                                                    </button>
                                                </div>
                                            `).join('');
                                        })()}
                                    </div>
                                ` : ''
                            ).join('') : 
                            '<div style="color: #6c757d; font-style: italic;">Добавьте бренды и вкусы для предварительного просмотра</div>'
                        }
                    </div>
                </div>
                
                <button class="save-button" onclick="app.handleMultiBrandAddTobaccos()">
                    Добавить ${app.multiBrands.reduce((total, brand) => total + brand.tastes.length, 0)} табаков в привоз
                </button>
            </div>
        `;
    }

    // Рендеринг таблицы табаков
    renderTobaccoTable(app) {
        if (app.tobaccos.length === 0) {
            return `
                <div class="empty-state">
                    <p>Табаки не найдены</p>
                    <p>Добавьте первый табак в привоз</p>
                </div>
            `;
        }

        // Поля инвентаризации больше не показываются
        const showInventoryFields = false;

        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Бренд</th>
                            <th>Вкус</th>
                            <th>Крепость</th>
                            <th>Цена</th>
                            <th>Вес</th>
                            <th>Дата заказа</th>
                            ${showInventoryFields ? `
                                <th>Дата инвентаризации</th>
                                <th>Вес на инвентаризации</th>
                                <th>Использование</th>
                            ` : ''}
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${app.tobaccos.map(tobacco => {
                        const usagePercentage = utils.calculateUsagePercentage(tobacco);
                        const usageColor = utils.getUsageColor(usagePercentage);
                        return `
                        <tr>
                            <td>${tobacco.brand_name || 'Не указано'}</td>
                            <td>${tobacco.taste || 'Не указано'}</td>
                            <td>
                                <span class="fortress-badge ${utils.getFortressClass(tobacco.fortress)}">
                                    ${utils.getFortressText(tobacco.fortress)} (${tobacco.fortress}/5)
                                </span>
                            </td>
                            <td class="price">${tobacco.price || 0} ₽</td>
                            <td>${tobacco.weight || 50} г</td>
                            <td>${tobacco.orderDate || 'Не указано'}</td>
                            ${showInventoryFields ? `
                                <td>${tobacco.inventoryDate || 'Не указано'}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        value="${utils.getInventoryWeightInGrams(tobacco)}" 
                                        min="0" 
                                        max="${tobacco.weight || 50}"
                                        style="width: 100%; max-width: 80px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.9rem;"
                                        onchange="app.updateInventoryWeight(${tobacco.id}, this.value)"
                                    /> г
                                </td>
                                <td>
                                    <span style="color: ${usageColor}; font-weight: bold;">
                                        ${usagePercentage}%
                                    </span>
                                </td>
                            ` : ''}
                            <td>
                                <button class="delete-button" onclick="app.handleDeleteTobacco(${tobacco.id})">
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    `;
                    }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Рендеринг модального окна с деталями привоза
    renderDeliveryModal(app) {
        if (!app.selectedDelivery) return '';

        return `
            <div class="modal-overlay" onclick="app.closeDeliveryModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">Детали привоза</h3>
                        <button class="modal-close" onclick="app.closeDeliveryModal()">&times;</button>
                    </div>
                    
                    <div class="delivery-cost-info" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; margin-bottom: 20px; border-radius: 12px; text-align: center; border: 1px solid #dee2e6;">
                        <h4 style="color: #495057; margin: 0 0 10px 0; font-size: 1.2rem;">Общая стоимость привоза</h4>
                        <div style="font-size: 2rem; font-weight: 700; color: #28a745;">${Math.round(app.selectedDelivery.cost || 0)} ₽</div>
                    </div>
                    
                    <div class="tobacco-table">
                        <div class="table-header">
                            <h3>Табаки в привозе</h3>
                        </div>
                        ${this.renderDeliveryTobaccoTable(app)}
                    </div>
                </div>
            </div>
        `;
    }

    // Рендеринг таблицы табаков в привозе
    renderDeliveryTobaccoTable(app) {
        if (!app.selectedDelivery || !app.selectedDelivery.tobaccos || app.selectedDelivery.tobaccos.length === 0) {
            return `
                <div class="empty-state">
                    <p>Табаки не найдены</p>
                </div>
            `;
        }

        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Бренд</th>
                            <th>Вкус</th>
                            <th>Крепость</th>
                            <th>Цена</th>
                            <th>Вес</th>
                            <th>Дата заказа</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${app.selectedDelivery.tobaccos.map(tobacco => `
                        <tr>
                            <td>${tobacco.brand_name || 'Не указано'}</td>
                            <td>${tobacco.taste || 'Не указано'}</td>
                            <td>
                                <span class="fortress-badge ${utils.getFortressClass(tobacco.fortress)}">
                                    ${utils.getFortressText(tobacco.fortress)} (${tobacco.fortress}/5)
                                </span>
                            </td>
                            <td class="price">${tobacco.price || 0} ₽</td>
                            <td>${tobacco.weight || 50} г</td>
                            <td>${tobacco.orderDate || 'Не указано'}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Рендеринг рекомендаций
    renderSuggestions(suggestions, type, brandIndex) {
        const typeLabels = {
            'brand': 'бренды',
            'taste': 'вкусы',
            'price': 'цены'
        };
        
        // Не показываем рекомендации по весу, так как вес устанавливается автоматически
        if (type === 'weight') {
            return '';
        }
        
        // Для цен и вкусов получаем динамические рекомендации на основе выбранного бренда
        let suggestionsToShow = suggestions;
        if ((type === 'price' || type === 'taste') && app.multiBrands[brandIndex] && app.multiBrands[brandIndex].brandName) {
            const brandName = app.multiBrands[brandIndex].brandName;
            
            if (type === 'price') {
                const brandMapping = app.brandPriceWeightMapping[brandName];
                if (brandMapping) {
                    // Показываем цены конкретно для этого бренда
                    suggestionsToShow = brandMapping.map(entry => entry.price);
                }
            } else if (type === 'taste') {
                const brandTasteMapping = app.brandTasteMapping[brandName];
                if (brandTasteMapping) {
                    // Показываем вкусы конкретно для этого бренда
                    suggestionsToShow = brandTasteMapping;
                }
            }
        }
        
        return `
            <div class="suggestions-container">
                <div class="suggestions-label">Популярные ${typeLabels[type]}:</div>
                <div class="suggestions-chips">
                    ${suggestionsToShow.map(suggestion => {
                        const value = type === 'price' ? suggestion : `'${suggestion}'`;
                        const displayValue = type === 'price' ? `${suggestion} ₽` : suggestion;
                        return `
                            <div class="suggestion-chip" onclick="app.select${type.charAt(0).toUpperCase() + type.slice(1)}Suggestion(${brandIndex}, ${value})">
                                ${displayValue}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Показ уведомлений
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Добавляем стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Цвета для разных типов уведомлений
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#6c757d';
        }
        
        // Добавляем в DOM
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Создаем глобальный экземпляр UI рендерера
const uiRenderer = new UIRenderer();
