import React from 'react';
import { Box, Button } from '@mui/material';

interface DesktopNavProps {
  handleMenuClick: (path: string) => void;
  pages: { name: string; path: string }[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ handleMenuClick, pages }) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page.name}
          onClick={() => handleMenuClick(page.path)}
          sx={{ my: 2, color: 'black', display: 'block' }}
        >
          {page.name}
        </Button>
      ))}
    </Box>
  );
};

export default DesktopNav;
