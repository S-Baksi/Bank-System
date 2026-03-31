// File: src/main/java/com/fintrack/dto/TransactionDTO.java
package com.fintrack.dto;

import java.math.BigDecimal;

public class TransactionDTO {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private BigDecimal amount;
    private BigDecimal transactionFee;
    private String type;
    private String status;
    private String referenceNumber;

    public static class TransferRequest {
        private Long fromAccountId;
        private Long toAccountId;
        private BigDecimal amount;
        private String description;

        public Long getFromAccountId() { return fromAccountId; }
        public void setFromAccountId(Long fromAccountId) { this.fromAccountId = fromAccountId; }
        public Long getToAccountId() { return toAccountId; }
        public void setToAccountId(Long toAccountId) { this.toAccountId = toAccountId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class DepositRequest {
        private Long accountId;
        private BigDecimal amount;
        private String description;

        public Long getAccountId() { return accountId; }
        public void setAccountId(Long accountId) { this.accountId = accountId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class WithdrawalRequest {
        private Long accountId;
        private BigDecimal amount;
        private String description;

        public Long getAccountId() { return accountId; }
        public void setAccountId(Long accountId) { this.accountId = accountId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private TransactionDTO dto = new TransactionDTO();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder fromAccountId(Long fromAccountId) { dto.fromAccountId = fromAccountId; return this; }
        public Builder toAccountId(Long toAccountId) { dto.toAccountId = toAccountId; return this; }
        public Builder amount(BigDecimal amount) { dto.amount = amount; return this; }
        public Builder transactionFee(BigDecimal transactionFee) { dto.transactionFee = transactionFee; return this; }
        public Builder type(String type) { dto.type = type; return this; }
        public Builder status(String status) { dto.status = status; return this; }
        public Builder referenceNumber(String referenceNumber) { dto.referenceNumber = referenceNumber; return this; }
        public TransactionDTO build() { return dto; }
    }

    public Long getId() { return id; }
    public Long getFromAccountId() { return fromAccountId; }
    public Long getToAccountId() { return toAccountId; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getTransactionFee() { return transactionFee; }
    public String getType() { return type; }
    public String getStatus() { return status; }
    public String getReferenceNumber() { return referenceNumber; }
}