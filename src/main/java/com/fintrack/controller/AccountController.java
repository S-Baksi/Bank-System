// File: src/main/java/com/fintrack/controller/AccountController.java
package com.fintrack.controller;

import com.fintrack.dto.AccountDTO;
import com.fintrack.entity.BankAccount;
import com.fintrack.entity.User;
import com.fintrack.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody AccountDTO.CreateRequest request, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            BankAccount account = accountService.createAccount(user, request.getAccountName(), request.getAccountType(), request.getInitialBalance());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(account));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Account creation failed"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAccounts(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<BankAccount> accounts = accountService.getUserAccounts(user);
            return ResponseEntity.ok(accounts.stream().map(this::convertToDTO).toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Failed to fetch accounts"));
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccount(@PathVariable Long accountId, Authentication authentication) {
        try {
            BankAccount account = accountService.getAccountById(accountId);
            return ResponseEntity.ok(convertToDTO(account));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Account not found"));
        }
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long accountId, Authentication authentication) {
        try {
            BankAccount account = accountService.getAccountById(accountId);
            return ResponseEntity.ok(new BalanceResponse(account.getBalance()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Account not found"));
        }
    }

    private AccountDTO convertToDTO(BankAccount account) {
        return AccountDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType().toString())
                .balance(account.getBalance())
                .status(account.getStatus().toString())
                .verified(account.getVerified())
                .build();
    }

    public static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }

    public static class BalanceResponse {
        public Object balance;
        public BalanceResponse(Object balance) { this.balance = balance; }
    }
}
