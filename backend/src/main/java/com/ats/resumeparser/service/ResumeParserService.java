package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Resume;
import com.ats.resumeparser.model.Resume.Education;
import com.ats.resumeparser.model.Resume.Experience;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeParserService {

    private final StanfordCoreNLP pipeline;
    private final Set<String> commonSkills;
    private final Set<String> educationKeywords;
    private final Set<String> experienceKeywords;

    public Resume parseResume(MultipartFile file) throws IOException {
        String content = extractText(file);
        Resume resume = new Resume();
        resume.setFileName(file.getOriginalFilename());
        resume.setFileType(file.getContentType());
        resume.setRawText(content);

        // Extract information
        resume.setSkills(extractSkills(content));
        resume.setEducation(extractEducation(content));
        resume.setExperiences(extractExperience(content));

        return resume;
    }

    private String extractText(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename().toLowerCase();
        if (fileName.endsWith(".pdf")) {
            return extractPdfText(file);
        } else if (fileName.endsWith(".docx")) {
            return extractDocxText(file);
        } else if (fileName.endsWith(".doc")) {
            return extractDocText(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format");
        }
    }

    private String extractPdfText(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractDocxText(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        }
    }

    private String extractDocText(MultipartFile file) throws IOException {
        // Add support for .doc files using Apache POI HWPF
        throw new UnsupportedOperationException("DOC format not supported yet");
    }

    private List<String> extractSkills(String content) {
        Set<String> extractedSkills = new HashSet<>();
        
        // NLP-based skill extraction
        CoreDocument document = new CoreDocument(content);
        pipeline.annotate(document);

        for (CoreLabel token : document.tokens()) {
            String word = token.word().toLowerCase();
            if (commonSkills.contains(word)) {
                extractedSkills.add(word);
            }
        }

        // Pattern-based skill extraction
        for (String skill : commonSkills) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(skill) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                extractedSkills.add(skill);
            }
        }

        return new ArrayList<>(extractedSkills);
    }

    private List<Education> extractEducation(String content) {
        List<Education> educationList = new ArrayList<>();
        
        // Use regex patterns to extract education information
        Pattern eduPattern = Pattern.compile(
            "(?i)(Bachelor|Master|PhD|B\\.?[A-Za-z]*|M\\.?[A-Za-z]*|Ph\\.?D)\\.?\\s+" +
            "(?:of|in)?\\s+" +
            "([^,\\n]*)" +
            "(?:,|\\sat\\s|\\sfrom\\s)\\s+" +
            "([^,\\n]*)" +
            "(?:,\\s*(\\d{4}))?",
            Pattern.MULTILINE
        );

        Matcher matcher = eduPattern.matcher(content);
        while (matcher.find()) {
            Education education = new Education();
            education.setDegree(matcher.group(1));
            education.setField(matcher.group(2));
            education.setInstitution(matcher.group(3));
            if (matcher.group(4) != null) {
                education.setGraduationYear(Integer.parseInt(matcher.group(4)));
            }
            educationList.add(education);
        }

        return educationList;
    }

    private List<Experience> extractExperience(String content) {
        List<Experience> experiences = new ArrayList<>();
        
        // Use regex patterns to extract work experience
        Pattern expPattern = Pattern.compile(
            "(?i)(.*?)\\s+at\\s+(.*?)\\s*" +
            "(?:from\\s+(\\d{2}/\\d{2}/\\d{4}|\\d{4})\\s*(?:to\\s+(\\d{2}/\\d{2}/\\d{4}|\\d{4}|present))?)?",
            Pattern.MULTILINE
        );

        Matcher matcher = expPattern.matcher(content);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        while (matcher.find()) {
            Experience experience = new Experience();
            experience.setTitle(matcher.group(1));
            experience.setCompany(matcher.group(2));
            
            if (matcher.group(3) != null) {
                try {
                    experience.setStartDate(LocalDateTime.parse(matcher.group(3), formatter));
                } catch (Exception e) {
                    log.warn("Could not parse start date: {}", matcher.group(3));
                }
            }
            
            if (matcher.group(4) != null && !matcher.group(4).equalsIgnoreCase("present")) {
                try {
                    experience.setEndDate(LocalDateTime.parse(matcher.group(4), formatter));
                } catch (Exception e) {
                    log.warn("Could not parse end date: {}", matcher.group(4));
                }
            } else {
                experience.setCurrent(true);
            }
            
            experiences.add(experience);
        }

        return experiences;
    }
} 