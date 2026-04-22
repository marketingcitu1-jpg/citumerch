package com.citu.inventory.controller;

import com.citu.inventory.model.Order;
import com.citu.inventory.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository repo;

    // Staff: get all orders (optionally filtered by status)
    @GetMapping
    public List<Order> getAll(@RequestParam(required = false) String status) {
        if (status != null) return repo.findByStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Mark order as claimed
    @PutMapping("/{id}/claim")
    public ResponseEntity<Order> claim(@PathVariable Long id) {
        return repo.findById(id).map(order -> {
            order.setStatus(Order.OrderStatus.CLAIMED);
            order.setDateClaimed(LocalDateTime.now());
            return ResponseEntity.ok(repo.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Mark order as paid
    @PutMapping("/{id}/pay")
    public ResponseEntity<Order> pay(@PathVariable Long id) {
        return repo.findById(id).map(order -> {
            order.setStatus(Order.OrderStatus.PAID);
            return ResponseEntity.ok(repo.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Public: student submits a pre-order
    @PostMapping("/student")
    public ResponseEntity<Order> submitStudentOrder(@RequestBody StudentOrderRequest request) {
        Order order = Order.builder()
                .studentName(request.studentName())
                .studentId(request.studentId())
                .studentEmail(request.email())
                .course(request.course())
                .yearLevel(request.year())
                .items(request.items())
                .totalAmount(request.totalAmount() != null ? BigDecimal.valueOf(request.totalAmount()) : BigDecimal.ZERO)
                .build();
        return ResponseEntity.ok(repo.save(order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Order deleted"));
    }

    record StudentOrderRequest(String studentName, String studentId, String email,
                               String course, String year, List<String> items, Double totalAmount) {}
}
