// File: src/main/java/com/fintrack/controller/TransactionController.java
package com.fintrack.controller;

import com.fintrack.dto.TransactionDTO;
import com.fintrack.entity.Transaction;
import com.fintrack.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestBody TransactionDTO.TransferRequest request, Authentication authentication) {
        try {
            Transaction transaction = transactionService.transferFunds(request.getFromAccountId(), request.getToAccountId(), request.getAmount(), request.getDescription());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionErrorResponse(e.getMessage(), "TRANSFER_ERROR"));
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody TransactionDTO.DepositRequest request, Authentication authentication) {
        try {
            Transaction transaction = transactionService.deposit(request.getAccountId(), request.getAmount(), request.getDescription());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionErrorResponse("Deposit failed", "DEPOSIT_ERROR"));
        }
    }

    @PostMapping("/withdrawal")
    public ResponseEntity<?> withdrawal(@RequestBody TransactionDTO.WithdrawalRequest request, Authentication authentication) {
        try {
            Transaction transaction = transactionService.withdrawal(request.getAccountId(), request.getAmount(), request.getDescription());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionErrorResponse("Withdrawal failed", "WITHDRAWAL_ERROR"));
        }
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactionHistory(@PathVariable Long accountId, Authentication authentication) {
        try {
            List<Transaction> transactions = transactionService.getAccountTransactionHistory(accountId);
            return ResponseEntity.ok(transactions.stream().map(this::convertToDTO).toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new TransactionErrorResponse("Failed to fetch history", "FETCH_ERROR"));
        }
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .fromAccountId(transaction.getFromAccount().getId())
                .toAccountId(transaction.getToAccount() != null ? transaction.getToAccount().getId() : null)
                .amount(transaction.getAmount())
                .transactionFee(transaction.getTransactionFee())
                .type(transaction.getType().toString())
                .status(transaction.getStatus().toString())
                .referenceNumber(transaction.getReferenceNumber())
                .build();
    }

    public static class TransactionErrorResponse {
        public String message;
        public String code;
        public TransactionErrorResponse(String message, String code) {
            this.message = message;
            this.code = code;
        }
    }
}