// File: src/main/java/com/fintrack/dto/LoginResponse.java
package com.fintrack.dto;

public class LoginResponse {
    private String token;
    private String refreshToken;
    private String type;
    private Long expiresIn;
    private String username;

    public LoginResponse(String token, String refreshToken, String type, Long expiresIn, String username) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.type = type;
        this.expiresIn = expiresIn;
        this.username = username;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}