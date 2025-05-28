import React from 'react';
import './CustomAlert.scss';
import { Alert } from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

type CustomAlertProps = {
  response: boolean;
  successResponse: string;
  errorResponse: string;
};
function CustomAlert({ response, successResponse, errorResponse }: CustomAlertProps) {
  return (
    <Alert
      icon={response ? <CheckIcon fontSize="inherit" /> : <ClearIcon fontSize="inherit" />}
      severity={response ? "success" : "error"}
    >
      {response ? successResponse : errorResponse}
    </Alert>
  );
}

export default CustomAlert;