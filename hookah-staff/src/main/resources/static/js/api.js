// API модуль для работы с сервером
class ApiService {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8080/api/tobacco';
        this.DELIVERY_API_URL = 'http://localhost:8080/api/delivery';
        this.AUTH_API_URL = 'http://localhost:8080/api/auth';
    }

    // Аутентификация
    async login(username, password) {
        try {
            const response = await fetch(`${this.AUTH_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            return { success: false, error: 'Ошибка подключения к серверу' };
        }
    }

    // Загрузка табаков
    async loadTobaccos() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/current`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, data: Array.isArray(data) ? data : [] };
            } else {
                console.error('Ошибка загрузки табаков:', response.statusText);
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            console.error('Ошибка загрузки табаков:', error);
            return { success: false, error: 'Ошибка подключения к серверу' };
        }
    }

    // Загрузка текущего привоза
    async loadCurrentDelivery() {
        try {
            const response = await fetch(`${this.DELIVERY_API_URL}/current`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                return { success: true, data: null };
            }
        } catch (error) {
            console.error('Ошибка загрузки текущего привоза:', error);
            return { success: true, data: null };
        }
    }

    // Загрузка завершенных привозов
    async loadFinalizedDeliveries() {
        try {
            const response = await fetch(`${this.DELIVERY_API_URL}/finalized`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, data: Array.isArray(data) ? data : [] };
            } else {
                return { success: true, data: [] };
            }
        } catch (error) {
            console.error('Ошибка загрузки завершенных привозов:', error);
            return { success: true, data: [] };
        }
    }

    // Создание нового привоза
    async createNewDelivery(createdBy) {
        try {
            const response = await fetch(`${this.DELIVERY_API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `createdBy=${createdBy}`
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('Ошибка создания привоза:', error);
            return { success: false, error: 'Ошибка создания привоза' };
        }
    }

    // Завершение привоза
    async finalizeDelivery(deliveryId, finalizedBy) {
        try {
            const response = await fetch(`${this.DELIVERY_API_URL}/${deliveryId}/finalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `finalizedBy=${finalizedBy}`
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('Ошибка завершения привоза:', error);
            return { success: false, error: 'Ошибка завершения привоза' };
        }
    }

    // Отмена привоза
    async cancelDelivery(deliveryId) {
        try {
            const response = await fetch(`${this.DELIVERY_API_URL}/${deliveryId}/cancel`, {
                method: 'DELETE'
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('Ошибка отмены привоза:', error);
            return { success: false, error: 'Ошибка отмены привоза' };
        }
    }

    // Получение деталей привоза
    async getDeliveryDetails(deliveryId) {
        try {
            // Загружаем табаки и стоимость привоза параллельно
            const [tobaccosResponse, costResponse] = await Promise.all([
                fetch(`${this.DELIVERY_API_URL}/${deliveryId}/tobaccos`),
                fetch(`${this.DELIVERY_API_URL}/${deliveryId}/cost`)
            ]);

            if (tobaccosResponse.ok && costResponse.ok) {
                const tobaccos = await tobaccosResponse.json();
                const cost = await costResponse.json();
                return { success: true, data: { tobaccos, cost } };
            } else {
                return { success: false, error: 'Ошибка загрузки деталей привоза' };
            }
        } catch (error) {
            console.error('Ошибка загрузки деталей привоза:', error);
            return { success: false, error: 'Ошибка загрузки деталей привоза' };
        }
    }

    // Добавление множественных табаков
    async addMultiBrandTobaccos(deliveryId, brands) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/multi-brand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deliveryId: deliveryId,
                    brands: brands.map(brand => ({
                        brandName: brand.brandName.trim(),
                        fortress: brand.fortress,
                        price: brand.price,
                        weight: brand.weight,
                        orderDate: brand.orderDate,
                        inventoryDate: brand.inventoryDate,
                        tastes: brand.tastes
                    }))
                })
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('Ошибка при добавлении табаков:', error);
            return { success: false, error: error.message };
        }
    }

    // Удаление табака
    async deleteTobacco(tobaccoId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/${tobaccoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: 'Ошибка при удалении табака' };
            }
        } catch (error) {
            console.error('Ошибка при удалении табака:', error);
            return { success: false, error: 'Ошибка при удалении табака' };
        }
    }

    // Обновление веса инвентаризации
    async updateInventoryWeight(tobaccoId, tobaccoData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/${tobaccoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tobaccoData)
            });

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: 'Ошибка при обновлении веса инвентаризации' };
            }
        } catch (error) {
            console.error('Ошибка при обновлении веса инвентаризации:', error);
            return { success: false, error: 'Ошибка при обновлении веса инвентаризации' };
        }
    }
}

// Создаем глобальный экземпляр API сервиса
const apiService = new ApiService();

