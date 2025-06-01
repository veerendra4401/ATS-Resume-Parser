package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.JobApplication;
import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.JobRepository;
import com.ats.resumeparser.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobMatchingService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    public List<Job> getRecommendedJobs(User user) {
        // Get user's skills from their latest resume
        List<Resume> userResumes = resumeRepository.findByUser(user);
        if (userResumes.isEmpty()) {
            return Collections.emptyList();
        }

        Resume latestResume = userResumes.get(userResumes.size() - 1);
        Set<String> userSkills = new HashSet<>(latestResume.getSkills());

        // Get all active jobs
        List<Job> activeJobs = jobRepository.findByActiveTrue(null).getContent();

        // Calculate match score for each job
        return activeJobs.stream()
            .map(job -> {
                double score = calculateMatchScore(userSkills, job);
                job.setMatchScore(score);
                return job;
            })
            .sorted(Comparator.comparingDouble(Job::getMatchScore).reversed())
            .collect(Collectors.toList());
    }

    public double calculateMatchScore(JobApplication application) {
        Resume resume = application.getResume();
        Job job = application.getJob();

        Set<String> candidateSkills = new HashSet<>(resume.getSkills());
        double score = calculateMatchScore(candidateSkills, job);
        
        // Update the application with the match score
        application.setMatchScore(score);
        
        return score;
    }

    private double calculateMatchScore(Set<String> candidateSkills, Job job) {
        Set<String> requiredSkills = new HashSet<>(job.getRequiredSkills());
        
        if (requiredSkills.isEmpty()) {
            return 0.0;
        }

        // Calculate basic skill match
        int matchingSkills = 0;
        for (String skill : requiredSkills) {
            if (candidateSkills.contains(skill.toLowerCase())) {
                matchingSkills++;
            }
        }

        // Calculate base score
        double baseScore = (double) matchingSkills / requiredSkills.size() * 100;

        // Apply experience level multiplier
        double experienceMultiplier = calculateExperienceMultiplier(job.getExperienceLevel());
        
        // Calculate final score
        return Math.min(100.0, baseScore * experienceMultiplier);
    }

    private double calculateExperienceMultiplier(String experienceLevel) {
        return switch (experienceLevel.toUpperCase()) {
            case "ENTRY" -> 1.0;
            case "MID" -> 1.2;
            case "SENIOR" -> 1.5;
            default -> 1.0;
        };
    }

    public List<Job> searchJobsWithFilters(
            String keyword,
            String location,
            String experienceLevel,
            Double minSalary,
            Double maxSalary,
            List<String> requiredSkills) {
        
        // Get initial results based on keyword
        List<Job> jobs = jobRepository.searchJobs(keyword, null).getContent();

        // Apply filters
        return jobs.stream()
            .filter(job -> matchesLocation(job, location))
            .filter(job -> matchesExperience(job, experienceLevel))
            .filter(job -> matchesSalaryRange(job, minSalary, maxSalary))
            .filter(job -> matchesRequiredSkills(job, requiredSkills))
            .collect(Collectors.toList());
    }

    private boolean matchesLocation(Job job, String location) {
        return location == null || location.isEmpty() ||
               job.getLocation().toLowerCase().contains(location.toLowerCase());
    }

    private boolean matchesExperience(Job job, String experienceLevel) {
        return experienceLevel == null || experienceLevel.isEmpty() ||
               job.getExperienceLevel().equalsIgnoreCase(experienceLevel);
    }

    private boolean matchesSalaryRange(Job job, Double minSalary, Double maxSalary) {
        if (minSalary == null && maxSalary == null) {
            return true;
        }
        
        Double jobMinSalary = job.getSalaryRangeStart();
        Double jobMaxSalary = job.getSalaryRangeEnd();
        
        if (jobMinSalary == null || jobMaxSalary == null) {
            return true;
        }
        
        return (minSalary == null || jobMaxSalary >= minSalary) &&
               (maxSalary == null || jobMinSalary <= maxSalary);
    }

    private boolean matchesRequiredSkills(Job job, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return true;
        }
        
        Set<String> jobSkills = new HashSet<>(job.getRequiredSkills());
        return jobSkills.containsAll(requiredSkills);
    }
} 