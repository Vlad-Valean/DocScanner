import { Box, Container, Typography, Button, FormControl, NativeSelect, InputLabel, styled } from '@mui/material';
import SecurityIcon from "@mui/icons-material/Security";
import React, { useEffect, useState, ChangeEvent } from 'react';
import './Account.scss';
import { updateUserSettings, uploadProfilePicture } from "../../Services/UserSettingsService";
import { UserSetting, Theme } from "../../Services/Types";
import { useColorScheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


type AccountProps = {
  token: string | null;
  showAlert: (message: string, success?: boolean) => void;
  userSettings: UserSetting;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSetting>>;
};

function Account({token, showAlert, userSettings, setUserSettings}: AccountProps) {
  const API_URL = "http://localhost:5099";
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    setMode(userSettings.theme as Theme);
  }, [token]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    if (!token) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfilePicture(token, file);
      setUserSettings((prev) => ({ ...prev, profilePictureUrl: imageUrl }));
    } catch (err) {
//      console.error("Upload failed", err);
      showAlert("Failed to upload profile picture", false);
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
              defaultValue={userSettings.theme ?? 'dark'}
              inputProps={{
                name: 'age',
                id: 'uncontrolled-native',
              }}
              value={mode}
              onChange={(event) => {
                  setUserSettings({ ...userSettings, theme: event.target.value.toUpperCase() as Theme});
                  setMode(event.target.value as Theme)
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
          <Button
            component="label"
            variant="contained"
            className="mb-3"
            startIcon={<CloudUploadIcon />}
          >
            {selectedFileName ?? "Upload file"}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>

          {userSettings.profilePictureUrl  ? (
            <img
              src={API_URL + userSettings.profilePictureUrl}
              alt="Profile preview"
              style={{
                maxWidth: "120px",
                maxHeight: "120px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : <></>}
        </Box>

        <Box py={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button
            variant="contained"
            disabled={saving || uploading}
            onClick={async () => {
              setSaving(true);
              try {
                if (token) await updateUserSettings(token, userSettings);
                showAlert("Settings updated!", true);
              } catch (err) {
                console.error(err);
                showAlert("Failed to save settings", false);
              } finally {
                setSaving(false);
              }
            }}
            sx={{ mt: 2 }}
          >
            Save Preferences
          </Button>
        </Box>
      </Box>

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
