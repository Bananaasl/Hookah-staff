package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.DeliveryTobacco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы со связями между привозами и табаками
 */
@Repository
public interface DeliveryTobaccoRepository extends JpaRepository<DeliveryTobacco, Long> {
    
    /**
     * Найти все связи для конкретного привоза с eager загрузкой табаков
     */
    @Query("SELECT dt FROM DeliveryTobacco dt JOIN FETCH dt.tobacco WHERE dt.delivery.id = :deliveryId")
    List<DeliveryTobacco> findByDeliveryId(Long deliveryId);
    
    /**
     * Найти все связи для конкретного табака
     */
    @Query("SELECT dt FROM DeliveryTobacco dt WHERE dt.tobacco.id = :tobaccoId")
    List<DeliveryTobacco> findByTobaccoId(Long tobaccoId);
    
    /**
     * Удалить все связи для конкретного привоза
     */
    @Query("DELETE FROM DeliveryTobacco dt WHERE dt.delivery.id = :deliveryId")
    void deleteByDeliveryId(Long deliveryId);
}
