package com.ats.resumeparser.repository;

import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUser(User user);
    
    @Query("SELECT r FROM Resume r WHERE r.user.id = ?1")
    List<Resume> findByUserId(Long userId);
    
    @Query("SELECT DISTINCT r FROM Resume r JOIN r.skills s WHERE s IN ?1")
    List<Resume> findBySkills(List<String> skills);
} 