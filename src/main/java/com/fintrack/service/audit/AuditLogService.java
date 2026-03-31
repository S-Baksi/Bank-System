package com.fintrack.service.audit;

import com.fintrack.entity.AuditLog;
import com.fintrack.entity.User;
import com.fintrack.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public AuditLog logAction(User user, String action, String entityType, Long entityId, String beforeValue, String afterValue, String ipAddress, String userAgent) {
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
        return paginate(auditLogRepository.findAll(), page, size);
    }

    public List<AuditLog> getFailedActions(int page, int size) {
        return paginate(auditLogRepository.findBySuccessFalseOrderByTimestampDesc(), page, size);
    }

    private List<AuditLog> paginate(List<AuditLog> auditLogs, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        int fromIndex = Math.min(safePage * safeSize, auditLogs.size());
        int toIndex = Math.min(fromIndex + safeSize, auditLogs.size());
        return auditLogs.subList(fromIndex, toIndex);
    }
}
