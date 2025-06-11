import React, { useState, useEffect } from 'react';
import { getUserSettings } from "../../../Services/UserSettingsService";
import { Box, Tooltip, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { MenuItemData } from '../../../Services/Types'
import { UserSetting } from "../../../Services/Types";


type AvatarMenuProps = {
  anchorElUser: HTMLElement | null;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
  handleMenuClick: (path: string) => void;
  settings: MenuItemData[];
};

const AvatarMenu = ({ settings, anchorElUser, handleCloseUserMenu, handleMenuClick, handleOpenUserMenu }: AvatarMenuProps) => {
  const token = localStorage.getItem("token"); // adjust if needed
  const API_URL = 'http://localhost:5099';
  const [userSettings, setUserSettings] = useState<UserSetting>({
    profilePictureUrl: '',
    theme: 'dark',
  });
  useEffect(() => {
    if (!token) return;
    getUserSettings(token)
      .then(setUserSettings)
      .catch((err) => console.error("Failed to load settings:", err));
  }, [token]);

  console.log(userSettings);
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User Avatar" src={userSettings.profilePictureUrl ? API_URL + userSettings.profilePictureUrl : "/static/images/avatar/2.jpg"} />
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
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={() => handleMenuClick(setting.path)}>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AvatarMenu;
