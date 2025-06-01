package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.Resume;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SkillMatchingService {

    public double calculateMatchScore(Resume resume, Job job) {
        List<String> candidateSkills = resume.getSkills();
        List<String> requiredSkills = job.getRequiredSkills();

        if (requiredSkills.isEmpty()) {
            return 0.0;
        }

        Set<String> matchedSkills = new HashSet<>(candidateSkills);
        matchedSkills.retainAll(requiredSkills);

        // Calculate match percentage
        double matchScore = (double) matchedSkills.size() / requiredSkills.size() * 100;

        // Bonus points for additional relevant skills
        Set<String> additionalSkills = new HashSet<>(candidateSkills);
        additionalSkills.removeAll(requiredSkills);
        
        // Add small bonus for each additional relevant skill
        double bonus = Math.min(additionalSkills.size() * 2, 20); // Max 20% bonus
        
        return Math.min(matchScore + bonus, 100.0);
    }

    public boolean isQualifiedCandidate(Resume resume, Job job) {
        double matchScore = calculateMatchScore(resume, job);
        return matchScore >= 60.0; // Minimum 60% match required
    }
} 