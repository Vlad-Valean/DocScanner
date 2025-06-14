import React, { ChangeEvent, useState } from "react";
import { Paper, Box, Button, Container, TextField, styled, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { uploadIdPhoto, updateIdData } from "../../Services/UploadService";


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

type UploadProps = {
  token: string | null;
  showAlert: (message: string, success?: boolean) => void;
};

function UploadPage({token, showAlert}: UploadProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState<{ [key: string]: string }>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
      showAlert("", true);
      setOcrData({});
    }
  };

  const handleUpload = async () => {
    if (!photo || !token) return;

    setLoading(true);

    const result = await uploadIdPhoto(photo, token);

    if (result.success && result.data) {
      showAlert(result.message, true);
      setOcrData(result.data); // expected parsed data
    } else {
      showAlert(result.message, false);
    }

    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!token || !ocrData.id) {
      showAlert("Missing token or ID.", false);
      return;
    }

    const result = await updateIdData(ocrData, token);

    showAlert(result.message, result.success);
  };

  const handleFieldChange = (key: string, value: string) => {
    setOcrData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Container fixed className="Upload d-flex flex-column justify-content-center align-content-center min-vh-100">
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Upload your id
      </Typography>
      <Box className="m-auto w-50 d-flex flex-column align-items-center" textAlign="center" py={6}>
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              style={{ maxWidth: "300px", maxHeight: "300px", marginBottom: "20px", objectFit: "contain" }}
            />
          )}

          <Button
            component="label"
            variant="contained"
            className="w-75 mb-3"
            startIcon={<CloudUploadIcon />}
          >
            {photo?.name ?? "Upload file"}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>

          <Button
            startIcon={<SaveIcon />}
            onClick={handleUpload}
            className="w-75 mb-4"
            variant="contained"
            color="inherit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Parse"}
          </Button>
        </Paper>
      </Box>
      { Object.keys(ocrData).length > 0 &&
      <Box className="m-auto w-50 d-flex flex-column align-items-center" textAlign="center" py={6}>
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          {/* Editable OCR Fields */}

            <div className="w-100 mb-3">
              <h5 className="text-center mb-3">Review & Edit Parsed Data</h5>
              {Object.entries(ocrData).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
              ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              className="w-100 mt-3"
              startIcon={<SaveIcon />}
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
        </Paper>
      </Box>
      }
    </Container>
  );
}

export default UploadPage;
