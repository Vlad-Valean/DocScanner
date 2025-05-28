import React from 'react';
import './CustomButton.scss';
import { Button } from '@mui/material';

type CustomButtonProps = {
  text: string;
  action?: string;
  className?: string;
};
function CustomButton({ text, action, className }: CustomButtonProps) {
  return (
      <Button variant="contained" color="inherit" className={className}>{text}</Button>
  );
}

export default CustomButton;