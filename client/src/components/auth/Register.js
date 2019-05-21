import React, { useState } from "react";
import Error from "../common/Error";

const Register = ({ setShowform }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState("");

  const submitSignup = async e => {
    try {
      e.preventDefault();

      const isInvalid =
        email.trim().length === 0 ||
        username.trim().length === 0 ||
        password.trim().length === 0;

      if (isInvalid) {
        return;
      }

      const reqBody = {
        query: `
        mutation CreateUser($email: String!, $username: String!, $password: String!){
          createUser(userInput:{email: $email, username: $username, password: $password}) {
            _id
            email
            username
          }
        }
      `,
        variables: {
          email,
          username,
          password
        }
      };

      const res = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const parsedRes = await res.json();

      if (parsedRes.errors !== undefined) {
        if (parsedRes.errors.length > 0) {
          setError(parsedRes.errors[0].message);
          return;
        }
      }

      setShowform("login");

      return parsedRes;
    } catch (err) {
      console.log(err);
      throw new Error("Registering failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={e => submitSignup(e)}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setError(null);
        }}
        id="email"
        placeholder="Email *"
      />
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Username *"
        value={username}
        onChange={e => {
          setUsername(e.target.value);
          setError(null);
        }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password *"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
          setError(null);
        }}
      />
      <button type="submit">Sign up</button>
      <button
        type="button"
        name="login"
        onClick={e => setShowform(e.target.name)}
      >
        Previous User? Click here!
      </button>
      {errors && <Error error={errors} />}
    </form>
  );
};

export default Register;
