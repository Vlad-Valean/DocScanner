import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch'
import { Role, MenuItemData, MenuType } from '../../Services/Types'
import MobileNav from './Components/MobileNav';
import DesktopNav from './Components/DesktopNav';
import AvatarMenu from "./Components/AvatarMenu";
import Logo from "./Components/Logo"
import { GetMenuItems } from "../../Services/MenuItemService"

type NavProps = {
  role: Role;
  isAuthenticated: boolean;
};

function Nav({ role, isAuthenticated }: NavProps) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const [pages, setPages] = React.useState<MenuItemData[]>([]);
  const [settings, setSettings] = React.useState<MenuItemData[]>([]);

  React.useEffect(() => {
    GetMenuItems(role ?? "")
      .then((items: MenuItemData[]) => {
        setPages(items.filter(item => item.type === MenuType.page));
        setSettings(items.filter(item => item.type === MenuType.setting));
      })
      .catch(err => {
        console.error("Failed to load menu items:", err);
      });
  }, [role]);

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
            pages={pages}
          />

          <Logo isMobile={true}/>

          <DesktopNav
            handleMenuClick={handleMenuClick}
            pages={pages}
          />

          <ThemeSwitch/>

          <AvatarMenu
            anchorElUser={anchorElUser}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            handleMenuClick={handleMenuClick}
            settings={settings}
          />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
