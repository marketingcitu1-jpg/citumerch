package com.citu.inventory.controller;

import com.citu.inventory.repository.InventoryItemRepository;
import com.citu.inventory.repository.OrderRepository;
import com.citu.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InventoryItemRepository inventoryRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
                "totalItems", inventoryRepo.countAllItems(),
                "lowStock", inventoryRepo.countLowStock(),
                "pendingOrders", orderRepo.countPending(),
                "totalStaff", userRepo.count()
        );
    }
}
