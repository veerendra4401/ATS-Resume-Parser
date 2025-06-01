package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.JobApplication;
import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.JobApplicationRepository;
import com.ats.resumeparser.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final SkillMatchingService skillMatchingService;

    @Transactional
    public JobApplication apply(Job job, User applicant, Resume resume, String coverLetter) {
        // Check if already applied
        Optional<JobApplication> existingApplication = applicationRepository.findByJobAndApplicant(job, applicant);
        if (existingApplication.isPresent()) {
            throw new IllegalStateException("You have already applied for this job");
        }

        // Calculate match score
        double matchScore = skillMatchingService.calculateMatchScore(resume, job);

        // Create application
        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setResume(resume);
        application.setCoverLetter(coverLetter);
        application.setMatchScore(matchScore);
        application.setStatus(JobApplication.Status.PENDING);

        return applicationRepository.save(application);
    }

    @Transactional
    public JobApplication updateStatus(Long applicationId, JobApplication.Status newStatus) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        
        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsByEmployer(Long employerId) {
        return applicationRepository.findByEmployerId(employerId);
    }

    public List<JobApplication> getApplicationsByApplicant(Long applicantId) {
        return applicationRepository.findByApplicantId(applicantId);
    }

    public List<JobApplication> getRankedApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobIdOrderByMatchScoreDesc(jobId);
    }
} 