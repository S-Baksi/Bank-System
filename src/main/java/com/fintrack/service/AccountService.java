// File: src/main/java/com/fintrack/service/AccountService.java
package com.fintrack.service;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.User;
import com.fintrack.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public BankAccount createAccount(User user, String accountName, BankAccount.AccountType accountType, BigDecimal initialBalance) {
        BankAccount account = new BankAccount();
        account.setUser(user);
        account.setAccountName(accountName);
        account.setAccountType(accountType);
        account.setBalance(initialBalance != null ? initialBalance : BigDecimal.ZERO);
        account.setAccountNumber("ACC" + System.currentTimeMillis());
        account.setIban("DE" + System.currentTimeMillis());
        account.setBic("COBADEFF");
        account.setStatus(BankAccount.AccountStatus.ACTIVE);
        account.setVerified(true);
        return bankAccountRepository.save(account);
    }

    public BankAccount getAccountById(Long id) {
        return bankAccountRepository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public List<BankAccount> getUserAccounts(User user) {
        return bankAccountRepository.findByUser(user);
    }

    public BankAccount updateAccount(Long accountId, String accountName, BankAccount.AccountStatus status) {
        BankAccount account = getAccountById(accountId);
        if (accountName != null) account.setAccountName(accountName);
        if (status != null) account.setStatus(status);
        return bankAccountRepository.save(account);
    }

    public void closeAccount(Long accountId) {
        BankAccount account = getAccountById(accountId);
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Cannot close account with remaining balance");
        }
        account.setStatus(BankAccount.AccountStatus.INACTIVE);
        bankAccountRepository.save(account);
    }

    public BigDecimal getAccountBalance(Long accountId) {
        return getAccountById(accountId).getBalance();
    }

    public void updateBalance(Long accountId, BigDecimal amount) {
        BankAccount account = getAccountById(accountId);
        account.setBalance(account.getBalance().add(amount));
        bankAccountRepository.save(account);
    }

    public void verifyAccount(Long accountId) {
        BankAccount account = getAccountById(accountId);
        account.setVerified(true);
        bankAccountRepository.save(account);
    }

    public void suspendAccount(Long accountId, String reason) {
        BankAccount account = getAccountById(accountId);
        account.setStatus(BankAccount.AccountStatus.FROZEN);
        bankAccountRepository.save(account);
    }
}