import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import heroImage from '../../assets/images/hero-image.svg';
import featuresBg from '../../assets/images/features-bg.svg';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Resume Parsing',
      description: 'Our AI-powered system automatically extracts and analyzes your skills, experience, and qualifications.',
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: 'Intelligent Job Matching',
      description: 'Advanced algorithms match your profile with the perfect job opportunities.',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: 'Employer Dashboard',
      description: 'Comprehensive tools for managing job postings, candidates, and hiring workflows.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Talent Pool',
      description: 'Access a vast pool of qualified candidates and streamline your recruitment process.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Reduce time-to-hire with automated screening and ranking of candidates.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security and compliance with data protection regulations.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '5K+', label: 'Companies' },
    { number: '50K+', label: 'Job Matches' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${featuresBg})`,
            backgroundSize: 'cover',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Transform Your Hiring Process with AI
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Streamline recruitment with our advanced ATS system powered by artificial intelligence
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/jobs')}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Browse Jobs
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src={heroImage}
                alt="ATS System"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 } }}>
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Powerful Features
        </Typography>
        <Grid container spacing={4} alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 3,
                      width: 80,
                      height: 80,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      opacity: 0.1,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        opacity: 0.2,
                      },
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { 
                        fontSize: 40,
                        color: 'primary.main',
                        position: 'relative',
                        zIndex: 1,
                      }
                    })}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      mb: 2,
                      minHeight: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Transform Your Hiring Process?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Join thousands of companies and job seekers who trust our platform
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 