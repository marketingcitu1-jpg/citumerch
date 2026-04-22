package com.citu.inventory.controller;

import com.citu.inventory.model.InventoryItem;
import com.citu.inventory.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryItemRepository repo;

    @GetMapping
    public List<InventoryItem> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        if (category != null) return repo.findByCategory(category);
        if (status != null) return repo.findByStatus(InventoryItem.ItemStatus.valueOf(status.toUpperCase()));
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InventoryItem> create(@RequestBody ItemRequest request) {
        InventoryItem item = InventoryItem.builder()
                .name(request.name())
                .category(request.category())
                .quantity(request.qty())
                .unitPrice(BigDecimal.valueOf(request.price()))
                .location(request.location())
                .status(request.status() != null
                        ? InventoryItem.ItemStatus.valueOf(request.status())
                        : InventoryItem.ItemStatus.IN_STOCK)
                .build();
        return ResponseEntity.ok(repo.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @RequestBody ItemRequest request) {
        return repo.findById(id).map(item -> {
            if (request.name() != null) item.setName(request.name());
            if (request.category() != null) item.setCategory(request.category());
            if (request.qty() != null) item.setQuantity(request.qty());
            if (request.price() != null) item.setUnitPrice(BigDecimal.valueOf(request.price()));
            if (request.location() != null) item.setLocation(request.location());
            if (request.status() != null) item.setStatus(InventoryItem.ItemStatus.valueOf(request.status()));
            return ResponseEntity.ok(repo.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Item deleted"));
    }

    record ItemRequest(String name, String category, Integer qty, Double price, String location, String status) {}
}
