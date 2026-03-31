package com.fintrack.repository;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccountOrderByTransactionDateDesc(BankAccount fromAccount, BankAccount toAccount);
    List<Transaction> findByFromAccountAndTransactionDateBetweenOrderByTransactionDateDesc(BankAccount fromAccount, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE (t.fromAccount = :account OR t.toAccount = :account) AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> getTransactionsBetweenDates(@Param("account") BankAccount account, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
