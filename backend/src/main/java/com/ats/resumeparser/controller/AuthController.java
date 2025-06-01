package com.ats.resumeparser.controller;

import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.UserRepository;
import com.ats.resumeparser.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.Getter;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        log.info("Received registration request for email: {}, role: {}", user.getEmail(), user.getRole());
        
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            log.warn("Email already exists: {}", user.getEmail());
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Email already registered");
        }

        try {
            // Validate user data
            if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
                log.warn("First name is required");
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
                log.warn("Last name is required");
                return ResponseEntity.badRequest().body("Last name is required");
            }
            if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                log.warn("Invalid email format");
                return ResponseEntity.badRequest().body("Invalid email format");
            }
            if (user.getPassword() == null || user.getPassword().length() < 6) {
                log.warn("Password must be at least 6 characters");
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            if (user.getRole() == null) {
                log.warn("Role is required");
                return ResponseEntity.badRequest().body("Role is required");
            }

            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            log.debug("Password encoded successfully");

            // Set email as verified (since we're not implementing email verification now)
            user.setEmailVerified(true);

            // Save user
            User savedUser = userRepository.save(user);
            log.info("Successfully saved user with ID: {}", savedUser.getId());

            // Generate token
            String token = tokenProvider.generateToken(savedUser);
            log.debug("JWT token generated successfully");

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during registration: ", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            log.info("Login attempt for email: {}", email);
            
            // Check if user exists first
            if (!userRepository.existsByEmail(email)) {
                log.warn("Login failed: User not found with email: {}", email);
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    email,
                    loginRequest.get("password")
                )
            );
            log.info("Authentication successful for user: {}", email);

            // Get user from authentication
            User user = (User) authentication.getPrincipal();
            log.info("User retrieved successfully: {}", user.getEmail());

            // Generate token
            String token = tokenProvider.generateToken(user);
            log.debug("JWT token generated successfully");

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", UserResponse.from(user));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed with error: ", e);
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
        }
    }

    @Getter
    @AllArgsConstructor
    private static class UserResponse {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private User.Role role;

        public static UserResponse from(User user) {
            return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
            );
        }
    }
} 