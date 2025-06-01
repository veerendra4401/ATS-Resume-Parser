import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { updateProfile, uploadResume } from '../../redux/actions/userActions';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSkillDialog, setOpenSkillDialog] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    title: user?.title || '',
    company: user?.company || '',
    bio: user?.bio || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await dispatch(updateProfile(formData));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(updateProfile({
        ...formData,
        skills: [...(user.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
      setOpenSkillDialog(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    dispatch(updateProfile({
      ...formData,
      skills: user.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      await dispatch(uploadResume(file));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
              <input
                accept="image/*"
                type="file"
                id="avatar-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  component="span"
                >
                  <EditIcon />
                </IconButton>
              </label>
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {user?.title || 'Professional Title'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Professional Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="GitHub URL"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <GitHubIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          {/* Skills Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Skills</Typography>
                <Tooltip title="Add Skill">
                  <IconButton onClick={() => setOpenSkillDialog(true)} color="primary">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user?.skills?.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Resume Upload Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resume
              </Typography>
              <Box sx={{ mt: 2 }}>
                <input
                  accept=".pdf,.doc,.docx"
                  type="file"
                  id="resume-upload"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    disabled={uploadingResume}
                  >
                    {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                  </Button>
                </label>
              </Box>
              {user?.resumes?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Latest Resume:
                  </Typography>
                  <Typography>
                    {user.resumes[user.resumes.length - 1].fileName}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Profile Completion Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Completion
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={user?.profileCompletionPercentage || 0}
                  size={80}
                  thickness={4}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="primary">
                    {user?.profileCompletionPercentage || 0}%
                  </Typography>
                </Box>
              </Box>
              <Typography color="text.secondary">
                Complete your profile to increase visibility to employers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Skill Dialog */}
      <Dialog open={openSkillDialog} onClose={() => setOpenSkillDialog(false)}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill"
            fullWidth
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSkill} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 