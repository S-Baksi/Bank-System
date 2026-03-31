package com.fintrack.controller;

import com.fintrack.dto.LoginRequest;
import com.fintrack.dto.LoginResponse;
import com.fintrack.dto.RegisterRequest;
import com.fintrack.entity.User;
import com.fintrack.service.UserService;
import com.fintrack.service.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String INVALID_CREDENTIALS_MSG = "Invalid credentials";

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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid refresh token", null));
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newToken = jwtTokenProvider.generateToken(username);
        return ResponseEntity.ok(new LoginResponse(newToken, refreshToken, "Bearer", 86400000L, username));
    }

    public static class ApiResponse {
        public String message;
        public Object data;

        public ApiResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }
    }
}
