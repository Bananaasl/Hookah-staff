package com.example.hookahstaff.repository;

import com.example.hookahstaff.entity.Delivery;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    @Query("SELECT d FROM Delivery d WHERE d.isFinalized = false ORDER BY d.deliveryDate DESC")
    Optional<Delivery> findCurrentDelivery();
    
    @Query("SELECT d FROM Delivery d WHERE d.isFinalized = true ORDER BY d.deliveryDate DESC")
    List<Delivery> findFinalizedDeliveries();
    
    List<Delivery> findByIsFinalizedOrderByDeliveryDateDesc(Boolean isFinalized);
    
    /**
     * Получить два предыдущих завершенных привоза перед указанным привозом
     * 
     * @param deliveryId идентификатор текущего привоза
     * @param pageable ограничение на количество результатов (должно быть PageRequest.of(0, 2))
     * @return список из двух предыдущих завершенных привозов (или меньше, если их нет)
     */
    @Query("SELECT d FROM Delivery d WHERE d.isFinalized = true AND d.id != :deliveryId ORDER BY d.deliveryDate DESC")
    List<Delivery> findTwoPreviousFinalizedDeliveries(Long deliveryId, Pageable pageable);
}



