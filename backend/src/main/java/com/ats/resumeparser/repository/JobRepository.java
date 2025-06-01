package com.ats.resumeparser.repository;

import com.ats.resumeparser.model.Job;
import com.ats.resumeparser.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployer(User employer);
    
    Page<Job> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.active = true AND j.title LIKE %?1% OR j.description LIKE %?1%")
    Page<Job> searchJobs(String keyword, Pageable pageable);
    
    @Query("SELECT DISTINCT j FROM Job j JOIN j.requiredSkills s WHERE s IN ?1 AND j.active = true")
    List<Job> findByRequiredSkills(List<String> skills);
    
    @Query("SELECT j FROM Job j WHERE j.employer.id = ?1")
    List<Job> findByEmployerId(Long employerId);
} 