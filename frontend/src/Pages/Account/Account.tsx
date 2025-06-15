import {
  Box,
  Container,
  Typography,
  Button,
  FormControl,
  NativeSelect,
  InputLabel,
  styled,
  Paper,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import React, { useEffect, useState, ChangeEvent } from 'react';
import './Account.scss';
import { updateUserSettings, uploadProfilePicture, fetchUserRecords } from '../../Services/UserSettingsService';
import { UserSetting, Theme } from '../../Services/Types';
import { useColorScheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RomanianIdRecord } from '../../Services/Types';

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

function Account({ token, showAlert, userSettings, setUserSettings }: AccountProps) {
  const API_URL = 'http://localhost:5099';
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    setMode(userSettings.theme as Theme);
  }, [setMode, userSettings]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    if (!token) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfilePicture(token, file);
      setUserSettings((prev) => ({ ...prev, profilePictureUrl: imageUrl }));
    } catch {
      showAlert('Failed to upload profile picture', false);
    } finally {
      setUploading(false);
    }
  }

  const [rows, setRows] = useState<RomanianIdRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await fetchUserRecords();
      if (data) {
        setRows(data);
      }
      setLoading(false);
    };
    loadRecords();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nume', headerName: 'Nume', width: 150 },
    { field: 'prenume', headerName: 'Prenume', width: 150 },
    { field: 'cnp', headerName: 'CNP', width: 180 },
    { field: 'cetatenie', headerName: 'Cetățenie', width: 120 },
    { field: 'sex', headerName: 'Sex', width: 90 },
    {
      field: 'dataNasterii',
      headerName: 'Data nașterii',
      width: 130,
      valueGetter: (params: { row?: RomanianIdRecord }) =>
        params.row?.dataNasterii ? new Date(params.row.dataNasterii).toLocaleDateString() : '',
    },
    {
      field: 'validitate',
      headerName: 'Validitate',
      width: 130,
      valueGetter: (params: { row?: RomanianIdRecord }) =>
        params.row?.validitate ? new Date(params.row.validitate).toLocaleDateString() : '',
    },
    { field: 'domiciliu', headerName: 'Domiciliu', width: 200 },
    { field: 'serie', headerName: 'Serie', width: 100 },
    { field: 'numar', headerName: 'Număr', width: 100 },
    { field: 'locNastere', headerName: 'Loc naștere', width: 150 },
  ];

return (
    <Container className="Account py-5 mt-5">
      <Typography variant="h3" className="fw-bold text-center mb-4">
        Account
      </Typography>

      <div className="row g-5">
        {/* Preferences Panel */}
        <div className="col-md-4">
          <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Preferences
              </Typography>
              <Divider className="mb-4" />

              {/* Theme Selection */}
              <FormControl sx={{ width: '50%' }} className="mb-4">
                <InputLabel variant="standard" htmlFor="theme-selector">
                  Theme
                </InputLabel>
                <NativeSelect
                  id="theme-selector"
                  value={mode}
                  onChange={(event) => {
                    setUserSettings({
                      ...userSettings,
                      theme: event.target.value as Theme,
                    });
                    setMode(event.target.value as Theme);
                  }}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </NativeSelect>
              </FormControl>

              {/* Upload + Image */}
              <Box display="flex" alignItems="center" flexDirection="column" justifyContent="center" gap={2}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                >
                  {selectedFileName ?? 'Upload Picture'}
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>

                {userSettings.profilePictureUrl && (
                  <img
                    src={API_URL + userSettings.profilePictureUrl}
                    alt="Profile preview"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2px solid #ccc',
                    }}
                  />
                )}
              </Box>

              {/* Save Button */}
              <Box display="flex" flexDirection="row" justifyContent="space-around" textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="error"
                  disabled={saving || uploading}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      setUserSettings({
                        profilePictureUrl: "",
                        theme: "system" as Theme,
                      });
                      if (token) await updateUserSettings(token, userSettings);
                      showAlert('Settings updated!', true);
                    } catch (err) {
                      console.error(err);
                      showAlert('Failed to reset settings', false);
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={saving || uploading}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      if (token) await updateUserSettings(token, userSettings);
                      showAlert('Settings updated!', true);
                    } catch (err) {
                      console.error(err);
                      showAlert('Failed to save settings', false);
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <div className="col-md-8">
          <Card sx={{ borderRadius: 4, boxShadow: 3, height: 510 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Reviewed Records
              </Typography>
              <Divider className="mb-3" />
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  getRowId={(row) => row.id}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Box textAlign="center" mt={5}>
        <SecurityIcon color="action" fontSize="large" />
        <Typography variant="body2" color="textSecondary" mt={1}>
          Your data is encrypted and securely handled. We never store your ID longer than necessary.
        </Typography>
      </Box>
    </Container>
  );
}

export default Account;
