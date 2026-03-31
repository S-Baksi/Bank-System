// File: src/main/java/com/fintrack/service/security/EncryptionService.java
package com.fintrack.service.security;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    private final int AES_KEY_SIZE = 256;
    private final int GCM_IV_LENGTH = 12;
    private final int GCM_TAG_LENGTH = 128;

    public String encrypt(String plaintext) {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
            keyGenerator.init(AES_KEY_SIZE);
            SecretKey key = keyGenerator.generateKey();

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecureRandom random = new SecureRandom();
            byte[] nonce = new byte[GCM_IV_LENGTH];
            random.nextBytes(nonce);

            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, nonce);
            cipher.init(Cipher.ENCRYPT_MODE, key, spec);

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes());
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
            byte[] nonce = new byte[GCM_IV_LENGTH];
            System.arraycopy(decodedData, 0, nonce, 0, GCM_IV_LENGTH);

            return "decrypted_placeholder";
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}