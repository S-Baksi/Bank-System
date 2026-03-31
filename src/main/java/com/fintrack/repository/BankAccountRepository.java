package com.fintrack.repository;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findByUser(User user);
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    List<BankAccount> findByStatus(BankAccount.AccountStatus status);
}
