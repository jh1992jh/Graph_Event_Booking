import React, { useContext } from "react";

import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [userCtx, dispatch] = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props =>
        userCtx.isAuth === true ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
