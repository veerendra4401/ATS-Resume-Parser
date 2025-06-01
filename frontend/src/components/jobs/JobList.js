import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch jobs from API
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'FULL_TIME',
        requiredSkills: ['React', 'Node.js', 'TypeScript'],
        description: 'Looking for an experienced software engineer...',
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'Web Solutions',
        location: 'New York',
        type: 'FULL_TIME',
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        description: 'Join our dynamic team of frontend developers...',
      },
    ];
    setJobs(mockJobs);
    setTotalPages(1);
  }, [page, searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    // TODO: Implement search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, skills, or company"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Search Jobs
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Job Cards */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {job.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {job.company}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{job.type}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  {job.requiredSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.description}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default JobList; 