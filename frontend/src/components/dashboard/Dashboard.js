import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import dashboardBg from '../../assets/images/dashboard-bg.svg';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const isEmployer = user?.role === 'EMPLOYER';
  const navigate = useNavigate();
  const theme = useTheme();

  const stats = isEmployer
    ? [
        { icon: <WorkIcon />, label: 'Active Jobs', value: '5', color: theme.palette.primary.main },
        { icon: <AssignmentIcon />, label: 'Total Applications', value: '28', color: theme.palette.success.main },
        { icon: <PersonIcon />, label: 'Shortlisted', value: '12', color: theme.palette.warning.main },
        { icon: <EmailIcon />, label: 'Messages', value: '8', color: theme.palette.info.main },
      ]
    : [
        { icon: <BusinessCenterIcon />, label: 'Applications', value: '7', color: theme.palette.primary.main },
        { icon: <CalendarTodayIcon />, label: 'Interviews', value: '3', color: theme.palette.success.main },
        { icon: <TrendingUpIcon />, label: 'Profile Views', value: '24', color: theme.palette.warning.main },
        { icon: <EmailIcon />, label: 'Messages', value: '5', color: theme.palette.info.main },
      ];

  const recentActivity = [
    {
      id: 1,
      title: isEmployer ? 'New application received' : 'Application viewed',
      description: isEmployer ? 'John Doe applied for Senior Developer position' : 'Tech Corp viewed your application',
      time: '2 hours ago',
      icon: <NotificationsIcon />,
    },
    {
      id: 2,
      title: isEmployer ? 'Interview scheduled' : 'Interview invitation',
      description: isEmployer ? 'Interview with Jane Smith at 2 PM' : 'Web Solutions - Frontend Developer position',
      time: '1 day ago',
      icon: <CalendarTodayIcon />,
    },
    {
      id: 3,
      title: isEmployer ? 'Job post expiring' : 'Profile match found',
      description: isEmployer ? 'Senior Developer post expires in 2 days' : 'New job matching your profile',
      time: '2 days ago',
      icon: <WorkIcon />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'grey.100',
        minHeight: '100vh',
        py: 4,
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: 'cover',
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: 'primary.main',
                }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.firstName}!
                </Typography>
                <Typography variant="subtitle1">
                  {isEmployer
                    ? "Here's what's happening with your job postings today."
                    : "Here's your job search activity overview."}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: { sm: 'auto' } }}
                onClick={() => navigate(isEmployer ? '/post-job' : '/upload-resume')}
              >
                {isEmployer ? 'Post New Job' : 'Upload Resume'}
              </Button>
            </Paper>
          </Grid>

          {/* Stats Section */}
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ ml: 'auto', fontWeight: 'bold' }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.description}
                            </Typography>
                            {' — '}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={isEmployer ? <WorkIcon /> : <BusinessCenterIcon />}
                    onClick={() => navigate(isEmployer ? '/post-job' : '/jobs')}
                  >
                    {isEmployer ? 'Post New Job' : 'Browse Jobs'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<PersonIcon />}
                    onClick={() => navigate('/profile')}
                  >
                    Update Profile
                  </Button>
                </Grid>
                {isEmployer && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      startIcon={<AssignmentIcon />}
                      onClick={() => navigate('/applications')}
                    >
                      View Applications
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 