package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_entity_type", columnList = "entityType")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(nullable = false, length = 100)
    private String entityType;

    @Column
    private Long entityId;

    @Column(columnDefinition = "LONGTEXT")
    private String beforeValue;

    @Column(columnDefinition = "LONGTEXT")
    private String afterValue;

    @Column(length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50)
    private String source;

    @Column(length = 500)
    private String failureReason;

    @Column(nullable = false)
    private Boolean success = true;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
