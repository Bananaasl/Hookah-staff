package com.example.hookahstaff.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Сущность связи между привозом и табаком
 * Представляет запись о том, какие табаки были в каком привозе
 */
@Entity
@Table(name = "delivery_tobacco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryTobacco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tobacco_id", nullable = false)
    private Tobacco tobacco;

    /**
     * Количество единиц табака в привозе
     */
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    /**
     * Вес пачки табака в граммах (для просмотра прошлых привозов)
     */
    @Column(name = "weight")
    private Integer weight;

    /**
     * Дата создания записи
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
