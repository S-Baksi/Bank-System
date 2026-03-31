package com.fintrack.service.audit;

import com.fintrack.entity.AuditLog;
import com.fintrack.entity.User;
import com.fintrack.repository.AuditLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog logAction(User user, String action, String entityType, Long entityId,
                              String beforeValue, String afterValue, String ipAddress, String userAgent) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setBeforeValue(beforeValue);
        auditLog.setAfterValue(afterValue);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setSuccess(true);
        auditLog.setTimestamp(LocalDateTime.now());
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getUserAuditLogs(User user) {
        return auditLogRepository.findByUserOrderByTimestampDesc(user);
    }

    public List<AuditLog> getEntityAuditLogs(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }

    public List<AuditLog> getFailedActions() {
        return auditLogRepository.findBySuccessFalseOrderByTimestampDesc();
    }

    public List<AuditLog> getAllAuditLogs(int page, int size) {
        return auditLogRepository.findAll(
                PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();
    }

    public List<AuditLog> getFailedActions(int page, int size) {
        return auditLogRepository.findBySuccessFalse(
                PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();
    }
}
