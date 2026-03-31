package com.fintrack.controller;

import com.fintrack.dto.AccountDTO;
import com.fintrack.entity.BankAccount;
import com.fintrack.entity.User;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.service.AccountService;
import com.fintrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO.CreateRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        BankAccount account = accountService.createAccount(
                user,
                request.getAccountName(),
                request.getAccountType(),
                request.getInitialBalance()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(account));
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<AccountDTO> accounts = accountService.getUserAccounts(user).stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(convertToDTO(accountService.getAccountById(accountId)));
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<BalanceResponse> getBalance(@PathVariable Long accountId) {
        return ResponseEntity.ok(new BalanceResponse(accountService.getAccountBalance(accountId)));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + username));
    }

    private AccountDTO convertToDTO(BankAccount account) {
        return AccountDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .verified(account.getVerified())
                .build();
    }

    public static class BalanceResponse {
        private final BigDecimal balance;

        public BalanceResponse(BigDecimal balance) {
            this.balance = balance;
        }

        public BigDecimal getBalance() {
            return balance;
        }
    }
}
