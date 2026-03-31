package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_from_account", columnList = "from_account_id"),
    @Index(name = "idx_to_account", columnList = "to_account_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_transaction_date", columnList = "transactionDate"),
    @Index(name = "idx_type", columnList = "type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id", nullable = false)
    private BankAccount fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private BankAccount toAccount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(precision = 19, scale = 2)
    private BigDecimal transactionFee;

    @Column(length = 500)
    private String beneficiaryName;

    @Column(length = 500)
    private String beneficiaryDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(length = 500)
    private String description;

    @Column(length = 255)
    private String referenceNumber;

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column
    private LocalDateTime completedDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransactionType { TRANSFER, DEPOSIT, WITHDRAWAL, BILL_PAYMENT, CHEQUE_DEPOSIT, INTEREST, CHARGE, REVERSAL }
    public enum TransactionStatus { PENDING, PROCESSING, COMPLETED, FAILED, REVERSED, CANCELLED }
}
