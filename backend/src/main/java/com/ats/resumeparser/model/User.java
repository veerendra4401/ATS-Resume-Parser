package com.ats.resumeparser.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "first_name")
    private String firstName;

    @NotBlank
    @Column(name = "last_name")
    private String lastName;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    @Column(name = "company_name")
    private String companyName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Resume> resumes = new ArrayList<>();

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
    private List<Job> postedJobs = new ArrayList<>();

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
    private List<JobApplication> jobApplications = new ArrayList<>();

    private boolean emailVerified = false;
    
    @Column(name = "email_verification_token")
    private String emailVerificationToken;
    
    @Column(name = "email_verification_token_expiry")
    private LocalDateTime emailVerificationTokenExpiry;
    
    @Column(name = "password_reset_token")
    private String passwordResetToken;
    
    @Column(name = "password_reset_token_expiry")
    private LocalDateTime passwordResetTokenExpiry;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "profile_completion_percentage")
    private Integer profileCompletionPercentage = 0;

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private List<String> jobPreferences = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;
    private String phoneNumber;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        JOBSEEKER,
        EMPLOYER
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
} 