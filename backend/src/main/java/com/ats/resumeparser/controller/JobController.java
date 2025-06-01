package com.ats.resumeparser.controller;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job, @AuthenticationPrincipal User user) {
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        job.setEmployer(user);
        job.setActive(true);
        return ResponseEntity.ok(jobRepository.save(job));
    }

    @GetMapping
    public ResponseEntity<Page<Job>> getActiveJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobRepository.findByActiveTrue(PageRequest.of(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Job>> searchJobs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobRepository.searchJobs(keyword, PageRequest.of(page, size)));
    }

    @GetMapping("/employer")
    public ResponseEntity<List<Job>> getEmployerJobs(@AuthenticationPrincipal User user) {
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(jobRepository.findByEmployer(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @RequestBody Job jobUpdate,
            @AuthenticationPrincipal User user) {
        return jobRepository.findById(id)
            .map(existingJob -> {
                if (!existingJob.getEmployer().getId().equals(user.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                jobUpdate.setId(id);
                jobUpdate.setEmployer(user);
                return ResponseEntity.ok(jobRepository.save(jobUpdate));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return jobRepository.findById(id)
            .map(job -> {
                if (!job.getEmployer().getId().equals(user.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                jobRepository.delete(job);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 