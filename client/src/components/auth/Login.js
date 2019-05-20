import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import AuthContext from "../../context/auth-context";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  static contextType = AuthContext;

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async submitSingup(e) {
    e.preventDefault();
    const { email, password } = this.state;

    const isInvalid = email.trim().length === 0 || password.trim().length === 0;

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
      throw new Error("Login failed, try again.");
    }

    const parsedResponse = await res.json();

    this.context.login(
      `Bearer ${parsedResponse.data.login.token}`,
      parsedResponse.data.login.userId,
      parsedResponse.data.login.tokenExp,
      parsedResponse.data.login.username
    );

    localStorage.setItem(
      "evauthToken",
      `Bearer ${parsedResponse.data.login.token}`
    );

    this.props.history.push("/events");
    return parsedResponse;
  }

  render() {
    const { setShowform } = this.props;
    const { email, password } = this.state;
    return (
      <form className="auth-form" onSubmit={e => this.submitSingup(e)}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={this.onInputChange}
          id="email"
          placeholder="Email *"
        />
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={password}
          onChange={this.onInputChange}
        />
        <button type="submit">Log in</button>
        <button
          type="button"
          name="register"
          onClick={e => setShowform(e.target.name)}
        >
          New User? Click here!
        </button>
      </form>
    );
  }
}

export default withRouter(Login);
