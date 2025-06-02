import React from 'react';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';


interface LogoProps {
  isMobile: boolean;
}
const displayMode = (isMobile: boolean) => (isMobile ? {xs: 'flex', md: 'none'} : {xs: 'none', md: 'flex'});

const Logo: React.FC<LogoProps> = ({ isMobile }) => (
  <>
    <AdbIcon sx={{ display: displayMode(isMobile), mr: 1 }} />
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: displayMode(isMobile),
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      DOCSCANNER
    </Typography>
  </>
);

export default Logo;
