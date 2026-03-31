// File: src/main/java/com/fintrack/controller/AuditController.java
package com.fintrack.controller;

import com.fintrack.service.audit.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AuditController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<?> getAllAuditLogs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size) {
        try {
            return ResponseEntity.ok(new AuditResponse("Audit logs retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch logs"));
        }
    }

    @GetMapping("/failed-actions")
    public ResponseEntity<?> getFailedActions(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size) {
        try {
            return ResponseEntity.ok(new AuditResponse("Failed actions retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch logs"));
        }
    }

    public static class AuditResponse {
        public String message;
        public AuditResponse(String message) { this.message = message; }
    }

    public static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }
}