import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch'
import { Role, Setting } from '../../Services/Types'
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import AvatarMenu from "./AvatarMenu";
import Logo from "./Logo"
import {FALSE} from "sass";

type NavProps = {
  role: Role;
  isAuthenticated: boolean;
};

const allPages: Setting[] = [
  { name: 'Home', path: '/', roles: [] },
  { name: 'Upload', path: '/upload', roles: ['User', 'Reviewer', 'Admin'] },
  { name: 'Dashboard', path: '/dashboard', roles: ['Reviewer', 'Admin'] },
];

const allSettings: Setting[] = [
  { name: 'Login', path: '/login', roles: [] },
  { name: 'Register', path: '/register', roles: [] },
  { name: 'Logout', path: '/logout', roles: ['User', 'Reviewer', 'Admin'] }
];

function Nav({ role, isAuthenticated }: NavProps) {
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
      navigate('/');
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  const filteredPages = allPages.filter(p =>
    !isAuthenticated
      ? p.name === 'Home' : role && p.roles.includes(role)
  );

  const filteredSettings = allSettings.filter(setting =>
    !isAuthenticated
      ? setting.name === 'Login' || setting.name === 'Register'
      : role && setting.roles.includes(role)
  );

  return (
    <AppBar position="fixed" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Logo isMobile={false}/>

          <MobileNav
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
            handleMenuClick={handleMenuClick}
            pages={filteredPages}
          />

          <Logo isMobile={true}/>

          <DesktopNav
            handleMenuClick={handleMenuClick}
            pages={filteredPages}
          />

          <ThemeSwitch/>

          <AvatarMenu
            anchorElUser={anchorElUser}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            handleMenuClick={handleMenuClick}
            settings={filteredSettings}
          />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
