package com.fintrack.controller;

import com.fintrack.dto.LoginRequest;
import com.fintrack.dto.LoginResponse;
import com.fintrack.dto.RegisterRequest;
import com.fintrack.entity.User;
import com.fintrack.service.UserService;
import com.fintrack.service.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    private static final String INVALID_CREDENTIALS_MSG = "Invalid credentials";

    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone(),
                "CUSTOMER"
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("User registered successfully", user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        // Use same error message for both unknown user and wrong password to prevent username enumeration
        User user = userService.findByUsername(request.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(INVALID_CREDENTIALS_MSG, null));
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, refreshToken, "Bearer", 86400000L, user.getUsername()));
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new com.fintrack.exception.ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(new ProfileResponse(
                user.getId(), user.getUsername(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getPhone(),
                user.getRole().name(), user.getCreatedAt(), user.getMfaEnabled()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Object> refreshToken(@RequestParam String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid refresh token", null));
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newToken = jwtTokenProvider.generateToken(username);
        return ResponseEntity.ok(new LoginResponse(newToken, refreshToken, "Bearer", 86400000L, username));
    }

    public static class ProfileResponse {
        private final Long id;
        private final String username;
        private final String email;
        private final String firstName;
        private final String lastName;
        private final String phone;
        private final String role;
        private final java.time.LocalDateTime memberSince;
        private final Boolean mfaEnabled;

        public ProfileResponse(Long id, String username, String email, String firstName, String lastName,
                               String phone, String role, java.time.LocalDateTime memberSince, Boolean mfaEnabled) {
            this.id = id; this.username = username; this.email = email;
            this.firstName = firstName; this.lastName = lastName; this.phone = phone;
            this.role = role; this.memberSince = memberSince; this.mfaEnabled = mfaEnabled;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getPhone() { return phone; }
        public String getRole() { return role; }
        public java.time.LocalDateTime getMemberSince() { return memberSince; }
        public Boolean getMfaEnabled() { return mfaEnabled; }
    }

    public static class ApiResponse {
        private final String message;
        private final Object data;

        public ApiResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }

        public String getMessage() {
            return message;
        }

        public Object getData() {
            return data;
        }
    }
}
