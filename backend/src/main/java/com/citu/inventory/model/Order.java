package com.citu.inventory.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "student_email")
    private String studentEmail;

    private String course;

    @Column(name = "year_level")
    private String yearLevel;

    @ElementCollection
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "item_name")
    private List<String> items;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "date_reserved")
    @Builder.Default
    private LocalDateTime dateReserved = LocalDateTime.now();

    @Column(name = "date_claimed")
    private LocalDateTime dateClaimed;

    public enum OrderStatus {
        PENDING, PAID, CLAIMED
    }
}
