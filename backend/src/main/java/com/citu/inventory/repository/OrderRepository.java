package com.citu.inventory.repository;

import com.citu.inventory.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(Order.OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    long countPending();
}
