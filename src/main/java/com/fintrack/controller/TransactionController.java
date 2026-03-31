package com.fintrack.controller;

import com.fintrack.dto.TransactionDTO;
import com.fintrack.entity.Transaction;
import com.fintrack.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transferFunds(@RequestBody TransactionDTO.TransferRequest request) {
        Transaction transaction = transactionService.transferFunds(
                request.getFromAccountId(),
                request.getToAccountId(),
                request.getAmount(),
                request.getDescription()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDTO> deposit(@RequestBody TransactionDTO.DepositRequest request) {
        Transaction transaction = transactionService.deposit(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
    }

    @PostMapping("/withdrawal")
    public ResponseEntity<TransactionDTO> withdrawal(@RequestBody TransactionDTO.WithdrawalRequest request) {
        Transaction transaction = transactionService.withdrawal(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(transaction));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(@PathVariable Long accountId) {
        List<TransactionDTO> transactions = transactionService.getAccountTransactionHistory(accountId).stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(transactions);
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .fromAccountId(transaction.getFromAccount().getId())
                .toAccountId(transaction.getToAccount() != null ? transaction.getToAccount().getId() : null)
                .amount(transaction.getAmount())
                .transactionFee(transaction.getTransactionFee())
                .type(transaction.getType().name())
                .status(transaction.getStatus().name())
                .referenceNumber(transaction.getReferenceNumber())
                .build();
    }
}
