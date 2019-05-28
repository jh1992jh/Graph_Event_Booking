import React, { useState } from "react";
import Success from "../common/Success";
import Error from "../common/Error";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [eventImg, setEventImg] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [price, setPrice] = useState(0.0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const createEvent = async e => {
    try {
      e.preventDefault();
      const token = localStorage.evauthToken;
      const reqBody = {
        query: `
            mutation CreateEvent($title: String!, $eventImg: String, $eventLocation: String!, $price: Float!, $description: String!, $date: String!) {
                createEvent(eventInput: {title: $title, eventImg: $eventImg, eventLocation: $eventLocation, price: $price, description: $description, date: $date}) {
                    _id
                    title
                    eventLocation
                    date
                }
            }
          `,
        variables: {
          title,
          eventImg,
          eventLocation,
          price: parseFloat(price),
          description,
          date
        }
      };

      const createdEvent = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      const parsedEvent = await createdEvent.json();

      if (parsedEvent.errors !== undefined) {
        if (parsedEvent.errors.length > 0) {
          setErrors(parsedEvent.errors[0].message);
          return;
        }
      }

      setTitle(parsedEvent.data.createEvent.title);
      setEventLocation(parsedEvent.data.createEvent.eventLocation);
      setDate(parsedEvent.data.createEvent.date);

      setShowSuccess(true);

      return parsedEvent;
    } catch (err) {
      throw err;
    }
  };
  return (
    <div className="create-event">
      <div className="create-event-form-wrapper">
        <h1>Create An Event</h1>
        <form onSubmit={e => createEvent(e)} className="create-event-form">
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Event Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            name="eventLocation"
            id="location"
            placeholder="Location"
            value={eventLocation}
            onChange={e => setEventLocation(e.target.value)}
          />
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <input
            type="text"
            name="eventImg"
            id="eventImg"
            placeholder="Event Image"
            value={eventImg}
            onChange={e => setEventImg(e.target.value)}
          />
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Event Description"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      {showSuccess && (
        <Success
          title={title}
          eventLocation={eventLocation}
          action="Created"
          date={new Date(date).toISOString()}
          setShowSuccess={setShowSuccess}
          redirectOnSuccess={true}
        />
      )}
      {errors && <Error error={errors} setErrors={setErrors} />}
    </div>
  );
};

export default CreateEvent;
