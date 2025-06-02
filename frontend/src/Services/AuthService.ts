import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";

const API_URL = 'http://localhost:5099/auth';

export async function loginUser(email: string, password: string, onAuthUpdate: () => void) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    const decoded = jwtDecode<any>(token);
    const roles =
      decoded.role ||
      decoded.roles ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const role = Array.isArray(roles) ? roles[0] : roles;

    localStorage.setItem('token', token);
    onAuthUpdate();

    return { success: true, token, role };
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data || 'Login failed',
    };
  }
}

export async function registerUser(email: string, password: string, confirmPassword: string, onAuthUpdate: () => void) {
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  try {
    await axios.post(`${API_URL}/register`, {
      email,
      password,
      confirmPassword,
    });

    return await loginUser(email, password, onAuthUpdate);

  } catch (error: any) {
    console.error('Registration failed:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data || 'Registration failed',
    };
  }
}

type Role = 'User' | 'Reviewer' | 'Admin' | null;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(null);

  const updateAuth = () => {
    const token = localStorage.getItem("token") ?? "";
    const isValid = !!token;
    setIsAuthenticated(isValid);

    if (isValid) {
      const decoded = jwtDecode<any>(token);
      const roles = decoded.role || decoded.roles || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const decodedRole = Array.isArray(roles) ? roles[0] : roles;
      setRole(decodedRole ?? "User");
    } else {
      setRole(null);
    }
  };

  useEffect(() => {
    updateAuth();
    const handleStorage = () => updateAuth();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { isAuthenticated, role, updateAuth };
}
