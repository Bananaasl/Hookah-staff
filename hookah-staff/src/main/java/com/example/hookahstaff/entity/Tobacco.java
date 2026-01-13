package com.example.hookahstaff.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Сущность табака для кальянной
 * 
 * <p>Представляет собой табак с информацией о бренде, вкусе, крепости,
 * цене, весе и датах заказа и инвентаризации.</p>
 * 
 * @author Hookah Staff Team
 * @version 1.0
 * @since 2025-01-01
 */
@Entity
@Table(name = "tobacco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tobacco {

    /**
     * Уникальный идентификатор табака
     */
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;

    /**
     * Цена за пачку табака в рублях
     */
    @Column(name = "price")
    private BigDecimal price;

    /**
     * Название бренда табака
     */
    @Column(name = "brand_name")
    private String brand_name;

    /**
     * Крепость табака от 1 до 5
     * 1-2: Легкий
     * 3-4: Средний  
     * 5: Крепкий
     */
    @Column(name = "fortress")
    private Integer fortress;

    /**
     * Дата заказа табака
     */
    @Column(name = "order_date")
    private LocalDate orderDate;

    /**
     * Дата последней инвентаризации
     */
    @Column(name = "inventory_date")
    private LocalDate inventoryDate;

    /**
     * Текущий вес табака на момент инвентаризации в граммах
     */
    @Column(name = "inventory_weight")
    private Integer inventoryWeight;

    /**
     * Вкус табака
     */
    @Column(name = "taste")
    private String taste;

    /**
     * Флаг первичного добавления табака
     * true - табак добавлен впервые (по умолчанию)
     * false - табак с таким же брендом и вкусом уже существует
     */
    @Column(name = "is_primary_addition", nullable = false)
    private Boolean isPrimaryAddition = true;

    /**
     * Оценка актуальности табака от 1.0 до 5.0
     * Используется для определения популярности и частоты заказа
     */
    @Column(name = "relevance_score", nullable = false, precision = 3, scale = 1)
    private BigDecimal relevanceScore = BigDecimal.valueOf(1.0);

    /**
     * Дата последнего обновления актуальности
     */
    @Column(name = "last_relevance_update")
    private LocalDateTime lastRelevanceUpdate;
}
