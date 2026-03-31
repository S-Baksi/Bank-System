// File: src/main/java/com/fintrack/dto/AccountDTO.java
package com.fintrack.dto;

import java.math.BigDecimal;

public class AccountDTO {
    private Long id;
    private String accountNumber;
    private String accountName;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private Boolean verified;

    public static class CreateRequest {
        private String accountName;
        private String accountType;
        private BigDecimal initialBalance;

        public String getAccountName() { return accountName; }
        public void setAccountName(String accountName) { this.accountName = accountName; }
        public String getAccountType() { return accountType; }
        public void setAccountType(String accountType) { this.accountType = accountType; }
        public BigDecimal getInitialBalance() { return initialBalance; }
        public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private AccountDTO dto = new AccountDTO();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder accountNumber(String accountNumber) { dto.accountNumber = accountNumber; return this; }
        public Builder accountName(String accountName) { dto.accountName = accountName; return this; }
        public Builder accountType(String accountType) { dto.accountType = accountType; return this; }
        public Builder balance(BigDecimal balance) { dto.balance = balance; return this; }
        public Builder status(String status) { dto.status = status; return this; }
        public Builder verified(Boolean verified) { dto.verified = verified; return this; }
        public AccountDTO build() { return dto; }
    }

    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public String getAccountName() { return accountName; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public String getStatus() { return status; }
    public Boolean getVerified() { return verified; }
}