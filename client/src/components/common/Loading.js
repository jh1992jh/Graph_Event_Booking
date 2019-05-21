import React from "react";

const Loading = () => (
  <div className="lds-css ng-scope" style={{ width: "200px", height: "200px" }}>
    <div style={{ width: "100%", height: "100%" }} className="lds-cube">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loading;
