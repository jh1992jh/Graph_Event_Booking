import React from "react";
import jwt_decode from "jwt-decode";

const checkToken = () => {
  if (localStorage.evauthToken) {
    const decoded = jwt_decode(localStorage.evauthToken);
    const currentTime = Date.now() / 1000;
    const expires = decoded.exp;

    if (expires < currentTime) {
      setTimeout(() => (window.location.href = "/"), 1000);
      localStorage.removeItem("evauthToken");
      return null;
    }

    return decoded;
  } else {
    return null;
  }
};
export default React.createContext({
  token: localStorage.evauthToken ? localStorage.evauthToken : null,
  userId: checkToken() !== null ? checkToken().userId : null,
  username: checkToken() !== null ? checkToken().username : null,

  login: (token, userid, tokenExp, username) => {},
  logout: () => {}
});
