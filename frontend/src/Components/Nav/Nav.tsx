import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch'

type Role = 'User' | 'Reviewer' | 'Admin' | null;

type Setting = {
  name: string;
  path: string;
  roles: Role[];
};

type NavProps = {
  role: Role;
  isAuthenticated: boolean;
};

const allPages = [
  { name: 'Home', path: '/', roles: [] },
  { name: 'Upload', path: '/upload', roles: ['User'] },
  { name: 'Reviewer Dashboard', path: '/dashboard', roles: ['Reviewer', 'Admin'] },
];

const allSettings: Setting[] = [
  { name: 'Dashboard', path: '/dashboard', roles: ['Reviewer', 'Admin'] },
  { name: 'Login', path: '/login', roles: [] },
  { name: 'Register', path: '/register', roles: [] },
  { name: 'Logout', path: '/logout', roles: ['User', 'Reviewer', 'Admin'] }
];

function Nav({ role, isAuthenticated }: NavProps) {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path: string) => {
    if (path === '/logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      navigate('/');
      window.location.reload();
    } else {
      navigate(path);
    }
  };


  const filteredPages = allPages.filter(p =>
    !p.roles || (role && p.roles.includes(role))
  );

  const filteredSettings = allSettings.filter(setting =>
    !isAuthenticated
      ? setting.name === 'Login' || setting.name === 'Register'
      : role && setting.roles.includes(role)
  );

  console.log('isAuthenticated:', isAuthenticated);
  console.log('role:', role);
  console.log('filteredSettings:', filteredSettings);

  return (
    <AppBar position="fixed" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DOCSCANNER
          </Typography>

          {/* Mobile Nav */}
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {filteredPages.map((page) => (
                <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); handleMenuClick(page.path); }}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DOCSCANNER
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {filteredPages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleMenuClick(page.path)}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <ThemeSwitch/>

          {/* Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {/*{username && (*/}
              {/*  <MenuItem disabled>*/}
              {/*    <Typography textAlign="center"><strong>{username}ceva</strong></Typography>*/}
              {/*  </MenuItem>*/}
              {/*)}*/}
              {filteredSettings.map((setting) => (
                <MenuItem key={setting.name} onClick={() => { handleCloseUserMenu(); handleMenuClick(setting.path); }}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
