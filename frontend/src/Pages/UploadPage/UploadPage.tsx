import React, { ChangeEvent, useState } from "react";
import CustomAlert from "../../Components/CustomAlert/CustomAlert";
import { Paper, Box, Button, Container, TextField, styled } from "@mui/material";
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

function UploadPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState({ value: "", success: true });
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState<{ [key: string]: string }>({});

  const token = localStorage.getItem("token");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
      setMessage({ value: "", success: true });
      setOcrData({});
    }
  };

  const handleUpload = async () => {
    if (!photo || !token) return;

    setLoading(true);

    const result = await uploadIdPhoto(photo, token);

    if (result.success && result.data) {
      setMessage({ value: result.message, success: true });
      setOcrData(result.data); // expected parsed data
    } else {
      setMessage({ value: result.message, success: false });
    }

    setLoading(false);
  };

  const handleUpdate = async () => {
    console.log("OCR Data Keys:", Object.keys(ocrData));
    console.log("OCR Data:", ocrData);

    if (!token || !ocrData.id) {
      setMessage({ value: "Missing token or ID.", success: false });
      return;
    }

    const result = await updateIdData(ocrData, token);

    setMessage({ value: result.message, success: result.success });
  };

  const handleFieldChange = (key: string, value: string) => {
    setOcrData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Container fixed className="Upload d-flex flex-column justify-content-center align-content-center min-vh-100">
      <h1 className="m-4 text-center">UPLOAD ID PHOTO</h1>
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

        {message.value && (
          <CustomAlert
            response={message.success}
            successResponse={message.value}
            errorResponse={message.value}
          />
        )}
    </Container>
  );
}

export default UploadPage;
