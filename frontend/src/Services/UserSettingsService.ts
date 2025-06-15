import { UserSetting } from "./Types"
import { RomanianIdRecord } from './Types';
import axios from 'axios';

const API_URL = "http://localhost:5099/api/usersettings";

export async function getUserSettings(token: string): Promise<UserSetting> {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user settings");
  }
  console.log(res)

  return res.json();
}

export async function updateUserSettings(
  token: string,
  settings: UserSetting
): Promise<void> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to update user settings");
  }
}

export async function uploadProfilePicture(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload-profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload profile picture");
  }

  const data = await res.json();
  return data.imageUrl;
}


export async function fetchUserRecords(): Promise<RomanianIdRecord[] | null> {
  try {
    const token = localStorage.getItem('token') ?? '';
    const response = await axios.get('http://localhost:5099/api/UserApi/records', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching reviewer records:', error);
    return null;
  }
}
