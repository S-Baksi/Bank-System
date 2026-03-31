package com.fintrack.controller;

import com.fintrack.dto.AuditLogDTO;
import com.fintrack.entity.AuditLog;
import com.fintrack.service.audit.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AuditController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogDTO>> getAllAuditLogs(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs(page, size).stream().map(this::toDto).toList()
        );
    }

    @GetMapping("/failed-actions")
    public ResponseEntity<List<AuditLogDTO>> getFailedActions(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(
                auditLogService.getFailedActions(page, size).stream().map(this::toDto).toList()
        );
    }

    private AuditLogDTO toDto(AuditLog auditLog) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(auditLog.getId());
        dto.setUsername(auditLog.getUser() != null ? auditLog.getUser().getUsername() : null);
        dto.setAction(auditLog.getAction());
        dto.setEntityType(auditLog.getEntityType());
        dto.setEntityId(auditLog.getEntityId());
        dto.setBeforeValue(auditLog.getBeforeValue());
        dto.setAfterValue(auditLog.getAfterValue());
        dto.setIpAddress(auditLog.getIpAddress());
        dto.setUserAgent(auditLog.getUserAgent());
        dto.setTimestamp(auditLog.getTimestamp());
        dto.setSuccess(auditLog.getSuccess());
        return dto;
    }
}
