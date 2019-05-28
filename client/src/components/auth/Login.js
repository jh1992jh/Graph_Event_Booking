import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";

import { UserContext } from "../../context/user-context";
import { LOGIN } from "../../reducers/types";

import Error from "../common/Error";

const Login = ({ setShowform, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [userCtx, dispatch] = useContext(UserContext);

  const submitSingup = async e => {
    try {
      e.preventDefault();

      const isInvalid =
        email.trim().length === 0 || password.trim().length === 0;

      if (isInvalid) {
        return;
      }

      const reqBody = {
        query: `
        query Login($email: String!, $password: String!){
            login(email: $email, password: $password) {
                userId
                token
                tokenExp
                username
            }
        }
      `,
        variables: {
          email,
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

      if (res.status !== 200 && res.status !== 201) {
        const error = await res.json();
        setErrors(error.errors[0].message);
        return;
      }

      const parsedResponse = await res.json();

      const { token, userId, tokenExp, username } = parsedResponse.data.login;

      const auth = { token, userId, tokenExp, username };

      localStorage.setItem(
        "evauthToken",
        `Bearer ${parsedResponse.data.login.token}`
      );

      await dispatch({ type: LOGIN, payload: auth });

      return history.push("/events");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form className="auth-form" onSubmit={e => submitSingup(e)}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        id="email"
        placeholder="Email *"
      />
      <input
        type="password"
        name="password"
        placeholder="Password *"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Log in</button>
      <button
        type="button"
        name="register"
        onClick={e => setShowform(e.target.name)}
      >
        New User? Click here!
      </button>
      {errors && <Error error={errors} setErrors={setErrors} />}
    </form>
  );
};

export default withRouter(Login);
