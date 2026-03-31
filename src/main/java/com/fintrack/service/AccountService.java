package com.fintrack.service;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.User;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.repository.BankAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class AccountService {

    private final BankAccountRepository bankAccountRepository;

    public AccountService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    @Transactional
    public BankAccount createAccount(User user, String accountName, String accountType, BigDecimal initialBalance) {
        BankAccount account = new BankAccount();
        account.setUser(user);
        account.setAccountName(accountName);
        account.setAccountType(BankAccount.AccountType.valueOf(accountType.toUpperCase(Locale.ROOT)));
        account.setBalance(initialBalance != null ? initialBalance : BigDecimal.ZERO);
        account.setAccountNumber("ACC" + System.currentTimeMillis());
        account.setIban("DE" + System.currentTimeMillis());
        account.setBic("COBADEFF");
        account.setStatus(BankAccount.AccountStatus.ACTIVE);
        account.setVerified(true);
        return bankAccountRepository.save(account);
    }

    public BankAccount getAccountById(Long id) {
        return bankAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));
    }

    public List<BankAccount> getUserAccounts(User user) {
        return bankAccountRepository.findByUser(user);
    }

    @Transactional
    public BankAccount updateAccount(Long accountId, String accountName, BankAccount.AccountStatus status) {
        BankAccount account = getAccountById(accountId);
        if (accountName != null && !accountName.isBlank()) {
            account.setAccountName(accountName);
        }
        if (status != null) {
            account.setStatus(status);
        }
        return bankAccountRepository.save(account);
    }

    @Transactional
    public void closeAccount(Long accountId) {
        BankAccount account = getAccountById(accountId);
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Cannot close account with remaining balance");
        }
        account.setStatus(BankAccount.AccountStatus.CLOSED);
        account.setClosedAt(LocalDateTime.now());
        bankAccountRepository.save(account);
    }

    public BigDecimal getAccountBalance(Long accountId) {
        return getAccountById(accountId).getBalance();
    }

    @Transactional
    public void updateBalance(Long accountId, BigDecimal amount) {
        BankAccount account = getAccountById(accountId);
        account.setBalance(account.getBalance().add(amount));
        bankAccountRepository.save(account);
    }

    @Transactional
    public void verifyAccount(Long accountId) {
        BankAccount account = getAccountById(accountId);
        account.setVerified(true);
        bankAccountRepository.save(account);
    }

    @Transactional
    public void suspendAccount(Long accountId, String reason) {
        BankAccount account = getAccountById(accountId);
        account.setStatus(BankAccount.AccountStatus.SUSPENDED);
        bankAccountRepository.save(account);
    }
}
