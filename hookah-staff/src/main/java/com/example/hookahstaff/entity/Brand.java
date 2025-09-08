package com.example.hookahstaff.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * Бренд табака
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Brand {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;

    @Column
    private String name;

    @Column
    private Integer fortress;

    @Column
    private BigDecimal price;

    @ManyToMany(mappedBy = "brands")
    private List<Taste> tastes;

    public Brand(String name, Integer fortress, BigDecimal price) {
        this.name = name;
        this.fortress = fortress;
        this.price = price;
    }

    // Временные методы для решения проблемы с IDE
    public void setTastes(List<Taste> tastes) {
        this.tastes = tastes;
    }

    public List<Taste> getTastes() {
        return tastes;
    }
}
