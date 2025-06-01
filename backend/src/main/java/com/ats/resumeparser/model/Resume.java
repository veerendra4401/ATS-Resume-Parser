package com.ats.resumeparser.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "resumes")
public class Resume {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_type")
    private String fileType;

    @ElementCollection
    @CollectionTable(name = "resume_skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Education> education = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String rawText;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Entity
    @Data
    @NoArgsConstructor
    @Table(name = "experiences")
    public static class Experience {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resume_id")
        @JsonBackReference
        private Resume resume;

        private String title;
        private String company;
        
        @Column(columnDefinition = "TEXT")
        private String description;
        
        @Column(name = "start_date")
        private LocalDateTime startDate;
        
        @Column(name = "end_date")
        private LocalDateTime endDate;
        
        private boolean current;
    }

    @Entity
    @Data
    @NoArgsConstructor
    @Table(name = "education")
    public static class Education {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resume_id")
        @JsonBackReference
        private Resume resume;

        private String degree;
        private String institution;
        private String field;
        private Integer graduationYear;
        
        @Column(name = "start_date")
        private LocalDateTime startDate;
        
        @Column(name = "end_date")
        private LocalDateTime endDate;
    }
} 