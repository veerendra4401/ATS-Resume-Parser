package com.ats.resumeparser.config;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

@Configuration
public class NLPConfig {

    @Bean
    public StanfordCoreNLP pipeline() {
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner");
        props.setProperty("ner.model", "edu/stanford/nlp/models/ner/english.all.3class.distsim.crf.ser.gz");
        return new StanfordCoreNLP(props);
    }

    @Bean
    public Set<String> commonSkills() {
        return new HashSet<>(Arrays.asList(
            // Programming Languages
            "java", "python", "javascript", "typescript", "c++", "c#", "ruby", "php", "swift", "kotlin", "go",
            "rust", "scala", "perl", "r", "matlab", "sql", "bash", "powershell",
            
            // Web Technologies
            "html", "css", "sass", "less", "react", "angular", "vue", "svelte", "jquery", "bootstrap",
            "tailwind", "material-ui", "webpack", "babel", "nodejs", "express", "nextjs", "gatsby",
            
            // Frameworks & Libraries
            "spring", "hibernate", "django", "flask", "laravel", "rails", "asp.net", "tensorflow",
            "pytorch", "keras", "scikit-learn", "pandas", "numpy", "junit", "jest", "mocha",
            
            // Databases
            "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "oracle",
            "mssql", "sqlite", "dynamodb", "couchbase", "neo4j",
            
            // Cloud & DevOps
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github", "bitbucket",
            "terraform", "ansible", "puppet", "chef", "prometheus", "grafana", "elk",
            
            // Mobile Development
            "android", "ios", "react native", "flutter", "xamarin", "ionic", "cordova",
            
            // Tools & Methodologies
            "git", "svn", "jira", "confluence", "agile", "scrum", "kanban", "tdd", "ci/cd",
            "rest", "graphql", "soap", "microservices", "oauth", "jwt",
            
            // Soft Skills
            "leadership", "communication", "teamwork", "problem solving", "project management",
            "time management", "analytical", "critical thinking", "creativity", "collaboration"
        ));
    }

    @Bean
    public Set<String> educationKeywords() {
        return new HashSet<>(Arrays.asList(
            "bachelor", "master", "phd", "doctorate", "b.tech", "m.tech", "b.e", "m.e",
            "b.sc", "m.sc", "bba", "mba", "associate degree", "diploma", "certification"
        ));
    }

    @Bean
    public Set<String> experienceKeywords() {
        return new HashSet<>(Arrays.asList(
            "experience", "work", "employment", "job", "position", "role", "responsibility",
            "project", "achievement", "accomplishment", "manager", "developer", "engineer",
            "analyst", "consultant", "specialist", "lead", "senior", "junior", "intern"
        ));
    }
} 