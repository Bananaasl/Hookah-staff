package com.example.hookahstaff.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Вкус табака
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Taste {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @ManyToMany
    @JoinTable(
            name = "brands_tastes", // Имя промежуточной таблицы в БД
            joinColumns = @JoinColumn(name = "brands_id"),
            inverseJoinColumns = @JoinColumn(name = "tastes_id")
    )
    private List<Brand> brands;

    // Временно отключаем связь с tobaccos для упрощения
    // @ManyToMany(mappedBy = "tastes")
    // private List<Tobacco> tobaccos;


    public Taste(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Временные методы для решения проблемы с IDE
    public void setBrands(List<Brand> brands) {
        this.brands = brands;
    }

    public List<Brand> getBrands() {
        return brands;
    }
}
