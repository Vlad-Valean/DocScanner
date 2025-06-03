import axios from "axios";

const API_URL = "http://localhost:5099/api/UserApi/";

export async function uploadIdPhoto(photo: File, token: string) {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    const response = await axios.post(API_URL + "upload", formData, {
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


export async function updateIdData(data: any, token: string) {
  try {
    const response = await fetch(API_URL + "update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    return {
      success: response.ok,
      message: response.ok ? "Updated successfully!" : resData || "Failed to update.",
    };
  } catch (error) {
    return { success: false, message: "Update request failed." };
  }
}

