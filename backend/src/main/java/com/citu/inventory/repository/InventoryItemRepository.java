package com.citu.inventory.repository;

import com.citu.inventory.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByCategory(String category);
    List<InventoryItem> findByStatus(InventoryItem.ItemStatus status);

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.status = 'LOW_STOCK' OR i.status = 'OUT_OF_STOCK'")
    long countLowStock();

    @Query("SELECT COUNT(i) FROM InventoryItem i")
    long countAllItems();
}
