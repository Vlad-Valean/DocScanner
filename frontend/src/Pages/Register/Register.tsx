import React, { useState } from 'react';
import './Register.scss';
import { Container, FormControl, FormHelperText, Input, InputLabel, Link } from "@mui/material";
import CustomAlert from "../../Components/CustomAlert/CustomAlert";
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = 'http://localhost:5099/auth'; // Adjust your backend URL and port here

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        confirmPassword
      });

      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <Container fixed className="Register d-flex flex-column justify-content-center align-content-center min-vh-100">
      <h1 className="m-4">REGISTER</h1>
      <form onSubmit={handleRegister} className="d-flex flex-column justify-content-center align-content-center w-25 m-auto my-3">
        <FormControl variant="standard" margin="normal">
          <InputLabel htmlFor="email-input">Email</InputLabel>
          <Input
            id="email-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-describedby="email-helper-text"
            required
            type="email"
          />
          <FormHelperText id="email-helper-text">Enter your email</FormHelperText>
        </FormControl>

        <FormControl variant="standard" margin="normal">
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <Input
            id="password-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-describedby="password-helper-text"
            required
            type="password"
          />
          <FormHelperText id="password-helper-text">Enter your password</FormHelperText>
        </FormControl>

        <FormControl variant="standard" margin="normal">
          <InputLabel htmlFor="confirm-password-input">Repeat password</InputLabel>
          <Input
            id="confirm-password-input"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            aria-describedby="confirm-password-helper-text"
            required
            type="password"
          />
          <FormHelperText id="confirm-password-helper-text">Repeat your password</FormHelperText>
        </FormControl>

        <CustomButton
          text="Register"
          className="w-50 m-auto mb-3"
          type="submit"
        />

        <Link href="/login" underline="hover" className="text-center">
          You already have an account? Log in
        </Link>
      </form>

      {(error || success) && (
        <CustomAlert
          response={success}
          successResponse={'Successfully registered'}
          errorResponse={"Error occurred"}
        />
      )}
    </Container>
  );
}

export default Register;
