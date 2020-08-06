import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";

const AuthenticationForm = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const data = {
      email,
      password,
      returnSecureToken: true,
    };

    // If sign up
    if (isSignUp) {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDungJQTA_dlkQY_0pKmcMdJB5K9ZMlOFs",
          data
        )
        .then((response) => {
          console.log(response.data);
          onAuthenticated(response.data);
        })
        .catch((err) => console.log(err));
    }
    // If sign in
    else {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDungJQTA_dlkQY_0pKmcMdJB5K9ZMlOFs",
          data
        )
        .then((response) => {
          console.log(response.data);
          onAuthenticated(response.data);
        })
        .catch((err) => console.log(err));
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="authentication">
      <Form onSubmit={onSubmitHandler}>
        <FormGroup>
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
