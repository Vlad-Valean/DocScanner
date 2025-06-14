import React, { useState } from 'react';
import './Register.scss';
import { Container, FormControl, FormHelperText, Input, InputLabel, Link, Typography } from "@mui/material";
import CustomButton from '../../Components/CustomButton/CustomButton';
import {registerUser} from "../../Services/AuthService";
import {useNavigate} from "react-router-dom";

type RegisterProps = {
  onAuthUpdate: () => void;
  showAlert: (message: string, success?: boolean) => void;
};
function Register({ onAuthUpdate, showAlert }: RegisterProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await registerUser(email, password, confirmPassword, onAuthUpdate);
    if (!result.success) {
      showAlert(result.message, false);
    } else {
      showAlert("Successfully registered and logged in!", true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/');
    }
  }

  return (
    <Container fixed className="Register d-flex flex-column justify-content-center align-content-center min-vh-100">
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Register
      </Typography>
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
    </Container>
  );
}

export default Register;
