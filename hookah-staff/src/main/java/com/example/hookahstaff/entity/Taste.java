package com.example.hookahstaff.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
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

    private String name;

    private String description;

    @Column
    @ManyToMany
    @JoinTable(
            name = "brands_tastes", // Имя промежуточной таблицы в БД
            joinColumns = @JoinColumn(name = "brands_id"),
            inverseJoinColumns = @JoinColumn(name = "tastes_id")
    )
    private List<Brand> brands;

    @Column
    @ManyToMany
    @JoinTable(
            name = "tobaccos_tastes", // Имя промежуточной таблицы в БД
            joinColumns = @JoinColumn(name = "tobaccos_id"),
            inverseJoinColumns = @JoinColumn(name = "tastes_id")
    )
    private List<Tobacco> tobaccos;
}
