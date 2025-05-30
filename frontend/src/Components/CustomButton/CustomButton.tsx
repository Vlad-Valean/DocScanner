import React from 'react';
import './CustomButton.scss';
import { Button } from '@mui/material';

type CustomButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean
};
function CustomButton({ text, className, onClick, type, disabled }: CustomButtonProps) {
  return (
      <Button
        variant="contained"
        color="inherit"
        className={className}
        onClick={onClick}
        type={type}
        disabled={disabled}>
        {text}
      </Button>
  );
}

export default CustomButton;