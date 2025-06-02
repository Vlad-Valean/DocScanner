import axios from "axios";

const API_URL = "http://localhost:5099/api/UserApi/upload";

export async function uploadIdPhoto(photo: File, token: string) {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: "Upload successful! ID data parsed.",
      data: response.data, // OCR parsed fields
    };
  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);
    return {
      success: false,
      message: "Upload failed. Please try again.",
    };
  }
}
