import { Box, Container, Typography, Button, FormControl, NativeSelect, InputLabel } from '@mui/material';
import SecurityIcon from "@mui/icons-material/Security";
import React, { useEffect, useState, ChangeEvent } from 'react';
import './Account.scss';
import { getUserSettings, updateUserSettings, uploadProfilePicture } from "../../Services/UserSettingsService";
import { UserSetting, Theme } from "../../Services/Types";
import { useColorScheme } from '@mui/material/styles';

function Account() {
  const [settings, setSettings] = useState<UserSetting>({
    profilePictureUrl: '',
    theme: 'System',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { mode, setMode } = useColorScheme();




  const token = localStorage.getItem("token"); // adjust if needed
  useEffect(() => {
    if (!token) return;

    getUserSettings(token)
      .then(setSettings)
      .catch((err) => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false));

    setMode(settings.theme as 'system' | 'light' | 'dark');
  }, [token]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!token) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfilePicture(token, file);
      setSettings((prev) => ({ ...prev, profilePictureUrl: imageUrl }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }



  return (
  <Container fixed className="Account d-flex flex-column justify-content-center align-content-center min-vh-100">
    <Box textAlign="center" py={3}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Account
      </Typography>

      {!loading && (
        <Box py={3}>
          <Typography variant="h5" gutterBottom>
            Preferences
          </Typography>

          <Box py={2}>

            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Theme
              </InputLabel>
              <NativeSelect
                defaultValue={'system'}
                inputProps={{
                  name: 'age',
                  id: 'uncontrolled-native',
                }}
                value={mode}
                onChange={(event) => {
                    setSettings({ ...settings, theme: event.target.value.toUpperCase() as 'System' | 'Light' | 'Dark'});
                    setMode(event.target.value as 'system' | 'light' | 'dark')
                  }
                }
              >
                <option value="system" >System </option>
                <option value="light" >Light </option>
                <option value="dark" >Dark </option>
              </NativeSelect>
            </FormControl>
          </Box>

          <Box py={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
            <label>Profile Picture:</label>
            {settings.profilePictureUrl && (
              <img
                src={settings.profilePictureUrl}
                alt="Profile"
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%' }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && <Typography variant="body2">Uploading...</Typography>}
          </Box>

          <Button
            variant="contained"
            disabled={saving || uploading}
            onClick={async () => {
              setSaving(true);
              try {
                if (token) await updateUserSettings(token, settings);
                alert("Settings updated!");
              } catch (err) {
                console.error(err);
                alert("Failed to save settings");
              } finally {
                setSaving(false);
              }
            }}
            sx={{ mt: 2 }}
          >
            Save Preferences
          </Button>
        </Box>
      )}

      <Box textAlign="center" py={3}>
        <SecurityIcon color="action" />
        <Typography variant="body2" color="textSecondary" mt={1}>
          Your data is encrypted and securely handled. We never store your ID longer than necessary.
        </Typography>
      </Box>
    </Box>
  </Container>

  );

}

export default Account;
