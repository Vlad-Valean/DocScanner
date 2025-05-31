import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import './Home.scss';
import UploadIcon from "@mui/icons-material/CloudUpload";
import SecurityIcon from "@mui/icons-material/Security";
import SearchIcon from "@mui/icons-material/TravelExplore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


function Home() {
  return (
      <>
        <Container fixed className="Home d-flex flex-column justify-content-center align-content-center">
          {/* Hero Section */}
          <Box textAlign="center" py={0} className="min-vh-100 justify-content-center align-content-center">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Scan and Submit Your ID
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Upload your ID photo securely. We’ll extract and review your information.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<UploadIcon />}
              href="/upload"
              sx={{ mt: 3 }}
            >
              Upload Your ID
            </Button>
          </Box>

          {/* How it works */}
          <Box py={4} className="min-vh-100">
            <Typography variant="h5" fontWeight="medium" gutterBottom textAlign="center">
              How It Works
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid>
                <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                  <UploadIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                    1. Upload Photo
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submit a clear photo of your ID using our secure upload page.
                  </Typography>
                </Paper>
              </Grid>
              <Grid>
                <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                  <SearchIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                    2. We Extract Data
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Our system automatically reads and structures the ID data.
                  </Typography>
                </Paper>
              </Grid>
              <Grid>
                <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                  <CheckCircleIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                    3. Human Review
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    A reviewer checks your data and confirms its validity.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Privacy notice */}
          <Box textAlign="center" py={3}>
            <SecurityIcon color="action" />
            <Typography variant="body2" color="textSecondary" mt={1}>
              Your data is encrypted and securely handled. We never store your ID longer than necessary.
            </Typography>
          </Box>
        </Container>
    </>
  );
}

export default Home;
