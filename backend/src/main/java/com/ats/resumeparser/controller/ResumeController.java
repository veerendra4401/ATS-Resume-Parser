package com.ats.resumeparser.controller;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.JobApplication;
import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.JobRepository;
import com.ats.resumeparser.repository.UserRepository;
import com.ats.resumeparser.repository.ResumeRepository;
import com.ats.resumeparser.service.JobApplicationService;
import com.ats.resumeparser.service.ResumeParserService;
import com.ats.resumeparser.service.SkillMatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeParserService resumeParserService;
    private final JobApplicationService jobApplicationService;
    private final SkillMatchingService skillMatchingService;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    @PostMapping("/resume/parse")
    public ResponseEntity<Resume> parseResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        try {
            log.info("Parsing resume for user: {}", user != null ? user.getEmail() : "anonymous");
            Resume resume = resumeParserService.parseResume(file);
            
            if (user != null) {
                resume.setUser(user);
                resume = resumeRepository.save(resume);
                log.info("Resume saved to database with ID: {}", resume.getId());
            }
            
            return ResponseEntity.ok(resume);
        } catch (IOException e) {
            log.error("Failed to parse resume: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user,
            @RequestParam("resumeFile") MultipartFile resumeFile,
            @RequestParam(value = "coverLetter", required = false) String coverLetter) {
        try {
            Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

            Resume resume = resumeParserService.parseResume(resumeFile);
            
            JobApplication application = jobApplicationService.apply(job, user, resume, coverLetter);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/applications/employer")
    public ResponseEntity<List<JobApplication>> getEmployerApplications(@AuthenticationPrincipal User user) {
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(jobApplicationService.getApplicationsByEmployer(user.getId()));
    }

    @GetMapping("/applications/applicant")
    public ResponseEntity<List<JobApplication>> getApplicantApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByApplicant(user.getId()));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<JobApplication> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User user) {
        
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            JobApplication.Status newStatus = JobApplication.Status.valueOf(request.get("status"));
            JobApplication updated = jobApplicationService.updateStatus(applicationId, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/{jobId}/applications/ranked")
    public ResponseEntity<List<JobApplication>> getRankedApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user) {
        
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(jobApplicationService.getRankedApplicationsForJob(jobId));
    }
} 