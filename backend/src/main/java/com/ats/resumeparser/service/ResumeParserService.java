package com.ats.resumeparser.service;

import com.ats.resumeparser.model.Resume;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class ResumeParserService {

    private final StanfordCoreNLP pipeline;
    private final Set<String> commonSkills;

    public ResumeParserService() {
        // Initialize NLP pipeline
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner");
        props.setProperty("ner.model", "edu/stanford/nlp/models/ner/english.all.3class.distsim.crf.ser.gz");
        this.pipeline = new StanfordCoreNLP(props);

        // Initialize common skills (you can load this from a file or database)
        this.commonSkills = new HashSet<>(Arrays.asList(
            "java", "python", "javascript", "react", "angular", "vue", "node.js", "spring",
            "hibernate", "mysql", "postgresql", "mongodb", "docker", "kubernetes", "aws",
            "azure", "git", "jenkins", "junit", "selenium", "agile", "scrum"
        ));
    }

    public Resume parseResume(MultipartFile file) throws IOException {
        log.info("Starting resume parsing for file: {}", file.getOriginalFilename());
        
        try {
            String content = extractText(file);
            log.debug("Successfully extracted text content from file");
            
            Resume resume = new Resume();
            resume.setFileName(file.getOriginalFilename());
            resume.setFileType(file.getContentType());
            resume.setRawText(content);

            // Extract skills
            log.debug("Extracting skills from content");
            Set<String> skills = extractSkills(content);
            resume.setSkills(new ArrayList<>(skills));
            log.debug("Found {} skills", skills.size());

            // Extract experience
            log.debug("Extracting experience information");
            List<Resume.Experience> experiences = extractExperience(content);
            resume.setExperiences(experiences);
            log.debug("Found {} experience entries", experiences.size());

            // Extract education
            log.debug("Extracting education information");
            List<Resume.Education> education = extractEducation(content);
            resume.setEducation(education);
            log.debug("Found {} education entries", education.size());

            log.info("Successfully parsed resume");
            return resume;
        } catch (Exception e) {
            log.error("Error parsing resume: ", e);
            throw e;
        }
    }

    private String extractText(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        log.debug("Extracting text from file of type: {}", contentType);
        
        try (InputStream input = file.getInputStream()) {
            if (contentType.equals("application/pdf")) {
                try (PDDocument document = PDDocument.load(input)) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    String text = stripper.getText(document);
                    log.debug("Successfully extracted text from PDF");
                    return text;
                }
            } else if (contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                try (XWPFDocument document = new XWPFDocument(input)) {
                    XWPFWordExtractor extractor = new XWPFWordExtractor(document);
                    String text = extractor.getText();
                    log.debug("Successfully extracted text from Word document");
                    return text;
                }
            }
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        } catch (Exception e) {
            log.error("Error extracting text from file: ", e);
            throw e;
        }
    }

    private Set<String> extractSkills(String content) {
        Set<String> skills = new HashSet<>();
        String[] words = content.toLowerCase().split("\\W+");
        
        for (String word : words) {
            if (commonSkills.contains(word)) {
                skills.add(word);
            }
        }

        // Use NLP for additional skill extraction
        CoreDocument document = new CoreDocument(content);
        pipeline.annotate(document);

        for (CoreLabel token : document.tokens()) {
            String ner = token.get(CoreAnnotations.NamedEntityTagAnnotation.class);
            if (ner.equals("ORGANIZATION") || ner.equals("MISC")) {
                String potential = token.word().toLowerCase();
                if (commonSkills.contains(potential)) {
                    skills.add(potential);
                }
            }
        }

        return skills;
    }

    private List<Resume.Experience> extractExperience(String content) {
        List<Resume.Experience> experiences = new ArrayList<>();
        
        // Pattern for experience extraction (simplified)
        Pattern pattern = Pattern.compile(
            "(?i)(\\b\\d{4}\\s*-\\s*(\\d{4}|present|current)\\b).*?\\b(at|@)?\\s*([A-Za-z0-9\\s&.,]+?)\\s*(?=\\d{4}|$)",
            Pattern.DOTALL
        );

        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            Resume.Experience exp = new Resume.Experience();
            exp.setCompany(matcher.group(4).trim());
            exp.setDescription(matcher.group(0).trim());
            experiences.add(exp);
        }

        return experiences;
    }

    private List<Resume.Education> extractEducation(String content) {
        List<Resume.Education> educationList = new ArrayList<>();
        
        // Pattern for education extraction (simplified)
        Pattern pattern = Pattern.compile(
            "(?i)(bachelor|master|phd|b\\.?tech|m\\.?tech|b\\.?e|m\\.?e)\\s*(?:of|in)?\\s*([^\\n,]*)",
            Pattern.MULTILINE
        );

        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            Resume.Education edu = new Resume.Education();
            edu.setDegree(matcher.group(1).trim());
            edu.setField(matcher.group(2).trim());
            educationList.add(edu);
        }

        return educationList;
    }
} 