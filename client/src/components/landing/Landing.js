import React from "react";
import { withRouter } from "react-router-dom";
import landingImg from "./graph_event.png";
import Auth from "../auth/Auth";

const Landing = ({ history }) => {
  localStorage.getItem("evauthToken") && history.push("/events");

  return (
    <div className="landing">
      <section className="showcase">
        <img src={landingImg} alt="Graph event" />
      </section>
      <div className="landing-auth">
        <h1>Graph Event</h1>
        <p>
          Create your own events and join events!
          <br /> What are you waiting for? Register an account now!
        </p>
        <Auth />
      </div>
    </div>
  );
};

export default withRouter(Landing);
