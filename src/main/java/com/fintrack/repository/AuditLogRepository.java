package com.fintrack.repository;

import com.fintrack.entity.AuditLog;
import com.fintrack.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserOrderByTimestampDesc(User user);
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    List<AuditLog> findBySuccessFalseOrderByTimestampDesc();
    Page<AuditLog> findBySuccessFalse(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.user.id = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> getUserAuditLogsBetweenDates(@Param("userId") Long userId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.success = false AND a.timestamp BETWEEN :startDate AND :endDate")
    long countFailedActionsInPeriod(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
}
