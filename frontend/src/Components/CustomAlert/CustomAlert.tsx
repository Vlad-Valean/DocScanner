import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import './CustomAlert.scss';

type CustomAlertProps = {
  open: boolean;
  onClose: () => void;
  response: boolean;
  message: string;
  duration?: number;
};

function CustomAlert({ open, onClose, response, message, duration = 4000 }: CustomAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={response ? 'success' : 'error'}
        icon={response ? <CheckIcon fontSize="inherit" /> : <ClearIcon fontSize="inherit" />}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomAlert;
