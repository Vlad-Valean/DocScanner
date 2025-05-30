import React, {ChangeEvent, useState} from "react";
import axios from "axios";
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomAlert from "../../Components/CustomAlert/CustomAlert";
import {Button, Container, styled} from "@mui/material";
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

function UploadPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState({"value": "", "success": true});
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
      setMessage({"value": "", "success": true});
    }
  };

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
  if (!photo) return;
  setLoading(true);

  const formData = new FormData();
  formData.append("photo", photo);

  try {
    const response = await axios.post(
      "http://localhost:5099/api/UserApi/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage({"value": "Upload successful! ID data parsed.", "success": true});
    console.log("Response data:", response.data);

  } catch (error) {
    console.error("Upload error:", error);
    setMessage({"value": "Upload failed. Please try again.", "success": false});
  } finally {
    setLoading(false);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setMessage({"value": "", "success": true});
  }
  };


  return (
    <Container fixed className="Upload d-flex flex-column justify-content-center align-content-center">
      <h1 className="m-4">UPLOAD ID PHOTO</h1>
      <div className="m-auto w-50 d-flex flex-column justify-content-around align-content-center">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          className="w-50 m-auto mb-3"
          startIcon={<CloudUploadIcon />}
        >
          {
            (<>
              {photo?.name ?? "Upload file"}
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </>) as React.ReactNode
          }
        </Button>
        <CustomButton
          text={loading ? "Saving..." : "Save"}
          onClick={handleUpload}
          className="w-50 m-auto mb-3"
          />
      </div>
      {(message.value) && (
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
