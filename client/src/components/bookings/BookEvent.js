import React, { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";

import Success from "../common/Success";

const BookEvent = props => {
  const [showSuccess, setShowSuccess] = useState(false);
  // const [showSuccessTimeoutId, setTimeoutId] = useState(null);

  const bookEventFun = async () => {
    try {
      const token = localStorage.evauthToken;
      const reqBody = {
        query: `
                mutation BookEvent($eventId: ID!){
                    bookEvent(eventId: $eventId) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
              `,
        variables: {
          eventId: props.match.params.eventId
        }
      };

      await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      setShowSuccess(true);
      return;
    } catch (err) {
      throw err;
    }
  };

  return (
    <Fragment>
      <button onClick={() => bookEventFun()}>Book Event</button>
      {showSuccess && (
        <Success
          action="Booked"
          title={null}
          eventLocation={null}
          date={null}
          setShowSuccess={setShowSuccess}
        />
      )}
    </Fragment>
  );
};

export default withRouter(BookEvent);
