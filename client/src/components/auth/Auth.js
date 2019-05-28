import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

const Auth = () => {
  const [showForm, setShowform] = useState("login");
  let displayForm;
  if (showForm === "login") {
    displayForm = <Login setShowform={setShowform} />;
  } else {
    displayForm = <Register setShowform={setShowform} />;
  }
  return <div className="auth">{displayForm}</div>;
};

export default withRouter(Auth);
