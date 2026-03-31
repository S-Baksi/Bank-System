#!/bin/bash

# Navigate to your repository
https://github.com/S-Baksi/FinTrack-OnlineBankingSystem.git

# Create all directories
mkdir -p src/main/java/com/fintrack/{entity,repository,service,controller,dto,exception,config}
mkdir -p src/main/java/com/fintrack/service/{audit,security}
mkdir -p src/main/resources
mkdir -p src/test/java

# ============ ENTITIES ============

cat > src/main/java/com/fintrack/entity/User.java << 'ENDFILE'
package com.fintrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Email
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean accountNonExpired = true;

    @Column(nullable = false)
    private Boolean accountNonLocked = true;

    @Column(nullable = false)
    private Boolean credentialsNonExpired = true;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Boolean mfaEnabled = false;

    @Column(length = 255)
    private String mfaSecret;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BankAccount> accounts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AuditLog> auditLogs = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LoginAttempt> loginAttempts = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() { return accountNonExpired; }

    @Override
    public boolean isAccountNonLocked() { return accountNonLocked; }

    @Override
    public boolean isCredentialsNonExpired() { return credentialsNonExpired; }

    @Override
    public boolean isEnabled() { return enabled; }

    public enum Role { CUSTOMER, ADMIN, MANAGER }
}
ENDFILE

cat > src/main/java/com/fintrack/entity/BankAccount.java << 'ENDFILE'
package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_account_number", columnList = "accountNumber"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String accountNumber;

    @Column(nullable = false, length = 34)
    private String iban;

    @Column(length = 11)
    private String bic;

    @Column(nullable = false, length = 50)
    private String accountName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(precision = 19, scale = 2)
    private BigDecimal overdraftLimit;

    @Column(precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime closedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AccountType { SAVINGS, CHECKING, BUSINESS, INVESTMENT }
    public enum AccountStatus { ACTIVE, SUSPENDED, CLOSED, PENDING_APPROVAL, DORMANT }
}
ENDFILE

cat > src/main/java/com/fintrack/entity/Transaction.java << 'ENDFILE'
package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_from_account", columnList = "from_account_id"),
    @Index(name = "idx_to_account", columnList = "to_account_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_transaction_date", columnList = "transactionDate"),
    @Index(name = "idx_type", columnList = "type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id", nullable = false)
    private BankAccount fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private BankAccount toAccount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(precision = 19, scale = 2)
    private BigDecimal transactionFee;

    @Column(length = 500)
    private String beneficiaryName;

    @Column(length = 500)
    private String beneficiaryDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(length = 500)
    private String description;

    @Column(length = 255)
    private String referenceNumber;

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column
    private LocalDateTime completedDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransactionType { TRANSFER, DEPOSIT, WITHDRAWAL, BILL_PAYMENT, CHEQUE_DEPOSIT, INTEREST, CHARGE, REVERSAL }
    public enum TransactionStatus { PENDING, PROCESSING, COMPLETED, FAILED, REVERSED, CANCELLED }
}
ENDFILE

cat > src/main/java/com/fintrack/entity/AuditLog.java << 'ENDFILE'
package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_entity_type", columnList = "entityType")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(nullable = false, length = 100)
    private String entityType;

    @Column
    private Long entityId;

    @Column(columnDefinition = "LONGTEXT")
    private String beforeValue;

    @Column(columnDefinition = "LONGTEXT")
    private String afterValue;

    @Column(length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50)
    private String source;

    @Column(length = 500)
    private String failureReason;

    @Column(nullable = false)
    private Boolean success = true;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
ENDFILE

cat > src/main/java/com/fintrack/entity/LoginAttempt.java << 'ENDFILE'
package com.fintrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_attempt_time", columnList = "attemptTime")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean successful;

    @Column(nullable = false, length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime attemptTime;

    @Column
    private Boolean mfaCompleted;

    @Column(length = 500)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        attemptTime = LocalDateTime.now();
    }
}
ENDFILE

# ============ REPOSITORIES ============

cat > src/main/java/com/fintrack/repository/UserRepository.java << 'ENDFILE'
package com.fintrack.repository;

import com.fintrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
ENDFILE

cat > src/main/java/com/fintrack/repository/BankAccountRepository.java << 'ENDFILE'
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
ENDFILE

cat > src/main/java/com/fintrack/repository/TransactionRepository.java << 'ENDFILE'
package com.fintrack.repository;

import com.fintrack.entity.BankAccount;
import com.fintrack.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccountOrderByTransactionDateDesc(BankAccount fromAccount, BankAccount toAccount);
    List<Transaction> findByFromAccountAndTransactionDateBetweenOrderByTransactionDateDesc(BankAccount fromAccount, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE (t.fromAccount = :account OR t.toAccount = :account) AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> getTransactionsBetweenDates(@Param("account") BankAccount account, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
ENDFILE

cat > src/main/java/com/fintrack/repository/AuditLogRepository.java << 'ENDFILE'
package com.fintrack.repository;

import com.fintrack.entity.AuditLog;
import com.fintrack.entity.User;
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
    
    @Query("SELECT a FROM AuditLog a WHERE a.user.id = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> getUserAuditLogsBetweenDates(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.success = false AND a.timestamp BETWEEN :startDate AND :endDate")
    long countFailedActionsInPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
ENDFILE

# ============ EXCEPTIONS ============

cat > src/main/java/com/fintrack/exception/ResourceNotFoundException.java << 'ENDFILE'
package com.fintrack.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
ENDFILE

cat > src/main/java/com/fintrack/exception/InvalidTransactionException.java << 'ENDFILE'
package com.fintrack.exception;

public class InvalidTransactionException extends RuntimeException {
    public InvalidTransactionException(String message) {
        super(message);
    }
    public InvalidTransactionException(String message, Throwable cause) {
        super(message, cause);
    }
}
ENDFILE

cat > src/main/java/com/fintrack/exception/InsufficientFundsException.java << 'ENDFILE'
package com.fintrack.exception;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
    public InsufficientFundsException(String message, Throwable cause) {
        super(message, cause);
    }
}
ENDFILE

# ============ APPLICATION PROPERTIES ============

cat > src/main/resources/application.properties << 'ENDFILE'
server.port=8080
server.servlet.context-path=/api/v1
spring.application.name=FinTrack

spring.datasource.url=jdbc:mysql://localhost:3306/fintrack_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

app.jwt.secret=your-super-secret-key-min-256-bits-long-for-security-purposes-change-this
app.jwt.expiration=86400000
app.jwt.refresh-expiration=604800000

app.encryption.algorithm=AES/GCM/NoPadding
app.encryption.key-size=256
app.encryption.iv-size=96

logging.level.root=INFO
logging.level.com.fintrack=DEBUG
logging.file.name=logs/fintrack.log

management.endpoints.web.exposure.include=health,info,metrics
ENDFILE

# ============ GITIGNORE ============

cat > .gitignore << 'ENDFILE'
target/
.idea/
.vscode/
*.class
*.jar
*.log
logs/
.DS_Store
.env
ENDFILE

# ============ DOCKERFILE ============

cat > Dockerfile << 'ENDFILE'
FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/fintrack-banking-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
ENDFILE

# ============ DOCKER COMPOSE ============

cat > docker-compose.yml << 'ENDFILE'
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: fintrack_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/fintrack_db
    ports:
      - "8080:8080"
    depends_on:
      - mysql

volumes:
  mysql_data:
ENDFILE

# ============ GIT COMMIT & PUSH ============

git add .
git commit -m "feat: Add FinTrack Banking System - Complete Project Structure

- Added 5 entity classes (User, BankAccount, Transaction, AuditLog, LoginAttempt)
- Added 4 repository interfaces with custom queries
- Added 3 exception classes
- Added pom.xml with Spring Boot 3.1.5 and all dependencies
- Added application.properties configuration
- Added Docker and docker-compose setup
- Added .gitignore file"

git push origin main

echo "✅ ALL FILES PUSHED SUCCESSFULLY!"