import React from 'react';
import './Register.scss';
import {Container, FormControl, FormHelperText, Input, InputLabel, Link} from "@mui/material";
import CustomAlert from "../../Components/CustomAlert/CustomAlert";
import CustomButton from '../../Components/CustomButton/CustomButton';

function Register() {
  return (
    <>
      <Container fixed className="Register d-flex flex-column justify-content-center align-content-center">
            <h1 className="m-4">REGISTER</h1>
            <div className="d-flex flex-column justify-content-center align-content-center w-25 m-auto my-3">
              <FormControl variant="standard">
                  <InputLabel htmlFor="component-helper">Email</InputLabel>
                  <Input
                    id="component-helper"
                    defaultValue=""
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    Some important helper text
                  </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel htmlFor="component-helper">Password</InputLabel>
                  <Input
                    id="component-helper"
                    defaultValue=""
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    Some important helper text
                  </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <InputLabel htmlFor="component-helper">Repeat password</InputLabel>
                    <Input
                      id="component-helper"
                      defaultValue=""
                      aria-describedby="component-helper-text"
                    />
                    <FormHelperText id="component-helper-text">
                      Some important helper text
                    </FormHelperText>
                  </FormControl>
              </div>
              <div className="d-flex flex-column justify-content-between align-content-center w-25 m-auto my-3">
                <CustomButton text={"Register"} className="w-50 m-auto mb-3"></CustomButton>
                <Link href="/login" underline="hover">
                  You already have an account, then log in
                </Link>
              </div>



              {false ??
                <CustomAlert
                  response={true}
                  successResponse={"Succesfully registered"}
                  errorResponse={"Error"}
                />}

      </Container>
    </>
  );
}

export default Register;
