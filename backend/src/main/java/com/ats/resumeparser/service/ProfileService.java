package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.User;
import com.ats.resumeparser.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;

    @Transactional
    public void updateProfileCompletionPercentage(User user) {
        Map<String, Boolean> completionStatus = calculateCompletionStatus(user);
        int completedFields = (int) completionStatus.values().stream().filter(v -> v).count();
        int totalFields = completionStatus.size();
        
        int percentage = (completedFields * 100) / totalFields;
        user.setProfileCompletionPercentage(percentage);
        
        userRepository.save(user);
    }

    public Map<String, Boolean> calculateCompletionStatus(User user) {
        Map<String, Boolean> status = new HashMap<>();

        // Basic Information
        status.put("firstName", isNotBlank(user.getFirstName()));
        status.put("lastName", isNotBlank(user.getLastName()));
        status.put("email", isNotBlank(user.getEmail()));
        status.put("phoneNumber", isNotBlank(user.getPhoneNumber()));
        status.put("location", isNotBlank(user.getLocation()));

        // Professional Information
        if (user.getRole() == User.Role.EMPLOYER) {
            status.put("companyName", isNotBlank(user.getCompanyName()));
        }

        // Additional Information
        status.put("bio", isNotBlank(user.getBio()));
        status.put("skills", !user.getSkills().isEmpty());
        status.put("jobPreferences", !user.getJobPreferences().isEmpty());

        // Professional Profiles
        status.put("linkedinUrl", isNotBlank(user.getLinkedinUrl()));
        status.put("githubUrl", isNotBlank(user.getGithubUrl()));
        status.put("portfolioUrl", isNotBlank(user.getPortfolioUrl()));

        // Resume
        status.put("hasResume", !user.getResumes().isEmpty());
        if (!user.getResumes().isEmpty()) {
            Resume latestResume = user.getResumes().get(user.getResumes().size() - 1);
            status.put("hasEducation", !latestResume.getEducation().isEmpty());
            status.put("hasExperience", !latestResume.getExperiences().isEmpty());
        } else {
            status.put("hasEducation", false);
            status.put("hasExperience", false);
        }

        return status;
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.trim().isEmpty();
    }

    @Transactional
    public User updateProfile(User user, Map<String, Object> updates) {
        if (updates.containsKey("firstName")) {
            user.setFirstName((String) updates.get("firstName"));
        }
        if (updates.containsKey("lastName")) {
            user.setLastName((String) updates.get("lastName"));
        }
        if (updates.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("location")) {
            user.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("companyName") && user.getRole() == User.Role.EMPLOYER) {
            user.setCompanyName((String) updates.get("companyName"));
        }
        if (updates.containsKey("linkedinUrl")) {
            user.setLinkedinUrl((String) updates.get("linkedinUrl"));
        }
        if (updates.containsKey("githubUrl")) {
            user.setGithubUrl((String) updates.get("githubUrl"));
        }
        if (updates.containsKey("portfolioUrl")) {
            user.setPortfolioUrl((String) updates.get("portfolioUrl"));
        }

        // Update completion percentage
        updateProfileCompletionPercentage(user);

        return userRepository.save(user);
    }
} 