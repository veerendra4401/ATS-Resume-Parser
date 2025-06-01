import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadResumeStart, uploadResumeSuccess, uploadResumeFailure } from '../../store/slices/resumeSlice';

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, parsedResume, skills } = useSelector((state) => state.resume);
  const { token } = useSelector((state) => state.auth);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      dispatch(uploadResumeFailure('Please upload a PDF or Word document'));
      return;
    }

    try {
      dispatch(uploadResumeStart());

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/v1/resume/parse', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to parse resume');
      }

      const data = await response.json();
      dispatch(uploadResumeSuccess(data));
    } catch (err) {
      dispatch(uploadResumeFailure(err.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Resume
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag and drop your resume here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
          <input
            type="file"
            id="resume-upload"
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          <label htmlFor="resume-upload">
            <Button
              component="span"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Browse Files
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Supported formats: PDF, DOC, DOCX
          </Typography>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {parsedResume && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Parsed Resume Data
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Extracted Skills
          </Typography>
          <Box sx={{ mb: 3 }}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                sx={{ m: 0.5 }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Experience
          </Typography>
          <List>
            {parsedResume.experience?.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={exp.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {exp.company}
                      </Typography>
                      {` • ${exp.duration}`}
                      <br />
                      {exp.description}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <List>
            {parsedResume.education?.map((edu, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={edu.degree}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {edu.institution}
                      </Typography>
                      {` • ${edu.year}`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default ResumeUpload; 