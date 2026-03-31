package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_attempt_time", columnList = "attemptTime")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean successful;

    @Column(nullable = false, length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime attemptTime;

    @Column
    private Boolean mfaCompleted;

    @Column(length = 500)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        attemptTime = LocalDateTime.now();
    }
}
