import React, { useState } from 'react';
import './Login.scss';
import {
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Link,
} from '@mui/material';
import CustomAlert from '../../Components/CustomAlert/CustomAlert';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../Services/AuthService";

type LoginProps = {
  onAuthUpdate: () => void;
};
function Login({ onAuthUpdate }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(email, password, onAuthUpdate);
    if (!result.success) {
      setError(result.message);
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);
      navigate('/');
      alert('Login successful!');
    }
  };

  return (
    <Container fixed className="Login d-flex flex-column justify-content-center align-content-center min-vh-100">
      <h1 className="m-4">LOGIN</h1>
      <form onSubmit={handleLogin}>
        <div className="d-flex flex-column justify-content-center align-content-center w-25 m-auto my-3">
          <FormControl variant="standard" className="mb-4">
            <InputLabel htmlFor="email-input">Email</InputLabel>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-helper"
              required
            />
            <FormHelperText id="email-helper">
              Enter your email address
            </FormHelperText>
          </FormControl>

          <FormControl variant="standard">
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <Input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-helper"
              required
            />
            <FormHelperText id="password-helper">
              Enter your password
            </FormHelperText>
          </FormControl>
        </div>

        <div className="d-flex flex-column justify-content-between align-content-center w-25 m-auto my-3">
          <CustomButton
            text={'Login'}
            className="w-50 m-auto mb-3"
            type="submit"
          />

          <Link href="/register" underline="hover">
            You don't have an account? Register here.
          </Link>
        </div>
      </form>

      {(error || success) && (
        <CustomAlert
          response={success}
          successResponse={'Successfully logged in'}
          errorResponse={"Error occurred"}
        />
      )}
    </Container>
  );
}

export default Login;
