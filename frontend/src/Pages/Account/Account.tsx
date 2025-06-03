import { Box, Container, Typography } from '@mui/material';
import SecurityIcon from "@mui/icons-material/Security";
import React from 'react';
import './Account.scss';


function Account() {

  return (
      <>
        <Container fixed className="Account d-flex flex-column justify-content-center align-content-center">
          <Box textAlign="center" py={0} className="min-vh-100 justify-content-center align-content-center">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Account
            </Typography>
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

export default Account;
