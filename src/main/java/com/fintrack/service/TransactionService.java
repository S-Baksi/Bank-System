package com.fintrack.service;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.Transaction;
import com.fintrack.exception.InsufficientFundsException;
import com.fintrack.exception.InvalidTransactionException;
import com.fintrack.repository.BankAccountRepository;
import com.fintrack.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    private static final BigDecimal TRANSACTION_FEE = new BigDecimal("0.50");

    public Transaction transferFunds(Long fromAccountId, Long toAccountId, BigDecimal amount, String description) {
        validatePositiveAmount(amount);

        BankAccount fromAccount = bankAccountRepository.findById(fromAccountId)
                .orElseThrow(() -> new InvalidTransactionException("From account not found"));
        BankAccount toAccount = bankAccountRepository.findById(toAccountId)
                .orElseThrow(() -> new InvalidTransactionException("To account not found"));

        BigDecimal totalAmount = amount.add(TRANSACTION_FEE);
        if (fromAccount.getBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException("Insufficient funds for transfer");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(totalAmount));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        bankAccountRepository.save(fromAccount);
        bankAccountRepository.save(toAccount);

        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setAmount(amount);
        transaction.setTransactionFee(TRANSACTION_FEE);
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setDescription(description);
        transaction.setReferenceNumber("TXN" + UUID.randomUUID().toString().substring(0, 12));
        transaction.setCompletedDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public Transaction deposit(Long accountId, BigDecimal amount, String description) {
        validatePositiveAmount(amount);

        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new InvalidTransactionException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        bankAccountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setFromAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionFee(BigDecimal.ZERO);
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setDescription(description);
        transaction.setReferenceNumber("DEP" + UUID.randomUUID().toString().substring(0, 12));
        transaction.setCompletedDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public Transaction withdrawal(Long accountId, BigDecimal amount, String description) {
        validatePositiveAmount(amount);

        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new InvalidTransactionException("Account not found"));

        BigDecimal totalAmount = amount.add(TRANSACTION_FEE);
        if (account.getBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(totalAmount));
        bankAccountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setFromAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionFee(TRANSACTION_FEE);
        transaction.setType(Transaction.TransactionType.WITHDRAWAL);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setDescription(description);
        transaction.setReferenceNumber("WTH" + UUID.randomUUID().toString().substring(0, 12));
        transaction.setCompletedDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new InvalidTransactionException("Transaction not found"));
    }

    public List<Transaction> getAccountTransactionHistory(Long accountId) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new InvalidTransactionException("Account not found"));
        return transactionRepository.findByFromAccountOrToAccountOrderByTransactionDateDesc(account, account);
    }

    public Transaction reverseTransaction(Long transactionId) {
        Transaction transaction = getTransactionById(transactionId);
        if (!Transaction.TransactionStatus.COMPLETED.equals(transaction.getStatus())) {
            throw new InvalidTransactionException("Only completed transactions can be reversed");
        }
        if (transaction.getToAccount() == null) {
            throw new InvalidTransactionException("Only transfer transactions can be reversed");
        }

        BankAccount fromAccount = transaction.getFromAccount();
        BankAccount toAccount = transaction.getToAccount();
        fromAccount.setBalance(fromAccount.getBalance().add(transaction.getAmount()).add(transaction.getTransactionFee()));
        toAccount.setBalance(toAccount.getBalance().subtract(transaction.getAmount()));
        bankAccountRepository.save(fromAccount);
        bankAccountRepository.save(toAccount);

        transaction.setStatus(Transaction.TransactionStatus.REVERSED);
        transaction.setCompletedDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    private void validatePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Amount must be greater than 0");
        }
    }
}
