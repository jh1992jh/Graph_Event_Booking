import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import AuthContext from "../../context/auth-context";

class Auth extends Component {
  state = {
    showForm: "login"
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.context.token && this.props.history.push("/events");
  }
  setShowform = val => {
    this.setState({ showForm: val });
  };
  render() {
    const { showForm } = this.state;
    return (
      <div className="auth">
        {showForm === "login" ? (
          <Login setShowform={this.setShowform} />
        ) : (
          <Register setShowform={this.setShowform} />
        )}
      </div>
    );
  }
}

export default withRouter(Auth);
