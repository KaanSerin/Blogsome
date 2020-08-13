import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import _ from "lodash";
import FadeInOnLoad from "../FadeInOnLoad/FadeInOnLoad";

const AuthenticationForm = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userDataFromResponse = (response) => {
    const currentDate = new Date();
    const expireDate = currentDate.setHours(
      currentDate.getHours() + response.data.expiresIn / 3600
    );
    return {
      idToken: response.data.idToken,
      localId: response.data.localId,
      expireDate,
      expiresIn: response.data.expiresIn,
    };
  };

  const formatErrorResponse = (error) => {
    return _.capitalize(error.response.data.error.message.replace(/_/g, " "));
  };

  const sendAuthenticationRequest = (url, data) => {
    axios
      .post(url, data)
      .then((response) => {
        const storedData = userDataFromResponse(response);

        localStorage.setItem("userData", JSON.stringify(storedData));

        onAuthenticated(storedData);
      })
      .catch((error) => {
        const errorMessage = formatErrorResponse(error);
        setErrorMessage(errorMessage);
      });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const data = {
      email,
      password,
      returnSecureToken: true,
    };

    const url = isSignUp
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDungJQTA_dlkQY_0pKmcMdJB5K9ZMlOFs"
      : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDungJQTA_dlkQY_0pKmcMdJB5K9ZMlOFs";

    sendAuthenticationRequest(url, data);

    setEmail("");
    setPassword("");
  };

  return (
    <FadeInOnLoad>
      <div className="authentication">
        <Form onSubmit={onSubmitHandler}>
          <FormGroup>
            {errorMessage !== "" ? (
              <p className="error-message">{errorMessage}</p>
            ) : null}
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="your@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormGroup>

          <Button color="danger">{isSignUp ? "Sign Up" : "Sign In"}</Button>
          <Button color="info" onClick={() => setIsSignUp(!isSignUp)}>
            Switch to {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </Form>
      </div>
    </FadeInOnLoad>
  );
};

export default AuthenticationForm;
