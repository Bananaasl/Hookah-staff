package com.example.hookahstaff.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Сам табак со ссылками на вкус, бренд и крепость
 */
@Entity
@Table(name = "tobacco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Tobacco {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;

    // Временно отключаем связь с tastes для упрощения
    // @ManyToMany(fetch = FetchType.LAZY)
    // @JoinTable(
    //         name = "tobaccos_tastes",
    //         joinColumns = @JoinColumn(name = "tobaccos_id"),
    //         inverseJoinColumns = @JoinColumn(name = "tastes_id")
    // )
    // private List<Taste> tastes;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "brand_name")
    private String brand_name;

    @Column(name = "fortress")
    private Integer fortress;

    @Column(name = "weight")
    private Integer weight; // Вес пачки в граммах

    @Column(name = "order_date")
    private LocalDate orderDate; // Дата заказа табака

    @Column(name = "inventory_date")
    private LocalDate inventoryDate; // Дата инвентаризации

    @Column(name = "inventory_weight")
    private Integer inventoryWeight; // Вес на дату инвентаризации

    @Column(name = "taste")
    private String taste; // Вкус табака
}
