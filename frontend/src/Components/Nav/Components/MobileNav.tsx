import React from 'react';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MenuItemData } from '../../../Services/Types'

interface MobileNavProps {
  anchorElNav: HTMLElement | null;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
  handleMenuClick: (path: string) => void;
  pages: MenuItemData[];
}

const MobileNav: React.FC<MobileNavProps> = ({ anchorElNav, handleOpenNavMenu, handleCloseNavMenu, handleMenuClick, pages }) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); handleMenuClick(page.path); }}>
            <Typography textAlign="center">{page.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MobileNav;
