package com.ats.resumeparser.controller;

import com.ats.resumeparser.model.User;
import com.ats.resumeparser.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final ProfileService profileService;

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody Map<String, Object> updates,
            @AuthenticationPrincipal User user) {
        log.info("Received profile update request for user: {}", user.getEmail());
        log.debug("Update data: {}", updates);
        
        try {
            User updatedUser = profileService.updateProfile(user, updates);
            log.info("Successfully updated profile for user: {}", user.getEmail());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating profile for user: {}", user.getEmail(), e);
            throw e;
        }
    }
} 