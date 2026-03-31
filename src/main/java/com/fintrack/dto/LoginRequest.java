// File: src/main/java/com/fintrack/dto/LoginRequest.java
package com.fintrack.dto;

public class LoginRequest {
    private String username;
    private String password;
    private String mfaCode;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getMfaCode() { return mfaCode; }
    public void setMfaCode(String mfaCode) { this.mfaCode = mfaCode; }
}