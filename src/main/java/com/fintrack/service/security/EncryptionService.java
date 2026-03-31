package com.fintrack.service.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Value("${app.encryption.secret:fintrack-default-encryption-secret}")
    private String encryptionSecret;

    private SecretKey getSecretKey() {
        byte[] keyBytes = Arrays.copyOf(encryptionSecret.getBytes(StandardCharsets.UTF_8), 32);
        return new SecretKeySpec(keyBytes, "AES");
    }

    public String encrypt(String plaintext) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] nonce = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(nonce);

            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), new GCMParameterSpec(GCM_TAG_LENGTH, nonce));
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            byte[] encryptedData = new byte[nonce.length + ciphertext.length];
            System.arraycopy(nonce, 0, encryptedData, 0, nonce.length);
            System.arraycopy(ciphertext, 0, encryptedData, nonce.length, ciphertext.length);
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decrypt(String encryptedData) {
        try {
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] nonce = Arrays.copyOfRange(decodedData, 0, GCM_IV_LENGTH);
            byte[] ciphertext = Arrays.copyOfRange(decodedData, GCM_IV_LENGTH, decodedData.length);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), new GCMParameterSpec(GCM_TAG_LENGTH, nonce));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
