import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import _ from "lodash";

const AuthenticationForm = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    axios
      .post(url, data)
      .then((response) => {
        const currentDate = new Date();
        const storedData = {
          idToken: response.data.idToken,
          localId: response.data.localId,
          expireDate: currentDate.setHours(
            currentDate.getHours() + response.data.expiresIn / 3600
          ),
          expiresIn: response.data.expiresIn,
        };

        localStorage.setItem("userData", JSON.stringify(storedData));

        onAuthenticated(storedData);
      })
      .catch((error) => {
        // convert the ugly error message to something more readable
        const errorMessage = _.capitalize(
          error.response.data.error.message.replace(/_/g, " ")
        );

        setErrorMessage(errorMessage);
      });

    setEmail("");
    setPassword("");
  };

  return (
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
  );
};

export default AuthenticationForm;
