import React, { useState } from "react";

const Register = ({ setShowform }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitSignup = e => {
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

    fetch(process.env.REACT_APP_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Registering failed, try again.");
        }

        return res.json();
      })
      .then(resData => console.log(resData))
      .catch(err => console.log(err));
  };

  return (
    <form className="auth-form" onSubmit={e => submitSignup(e)}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        id="email"
        placeholder="Email *"
      />
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Username *"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Password *"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Sign up</button>
      <button
        type="button"
        name="login"
        onClick={e => setShowform(e.target.name)}
      >
        Previous User? Click here!
      </button>
    </form>
  );
};

export default Register;
