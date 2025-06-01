package com.ats.resumeparser.repository;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.JobApplication;
import com.ats.resumeparser.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicant(User applicant);
    
    List<JobApplication> findByJob(Job job);
    
    Optional<JobApplication> findByJobAndApplicant(Job job, User applicant);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.employer.id = ?1")
    List<JobApplication> findByEmployerId(Long employerId);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.applicant.id = ?1")
    List<JobApplication> findByApplicantId(Long applicantId);
    
    @Query("SELECT COUNT(ja) > 0 FROM JobApplication ja WHERE ja.job.id = ?1 AND ja.applicant.id = ?2")
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.id = ?1 ORDER BY ja.matchScore DESC")
    List<JobApplication> findByJobIdOrderByMatchScoreDesc(Long jobId);
} 