import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
import Success from "../common/Success";

class CreateEvent extends Component {
  state = {
    title: "",
    eventImg: "",
    eventLocation: "",
    price: 0.0,
    description: "",
    date: "",
    showSuccess: false,
    successTimeout: null
  };

  static contextType = AuthContext;

  async createEvent(e) {
    try {
      e.preventDefault();
      const {
        title,
        eventImg,
        eventLocation,
        price,
        description,
        date
      } = this.state;
      const token = this.context.token;

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

      if (createdEvent.status !== 200 && createdEvent.status !== 201) {
        throw new Error("Error creating the event, try again later!");
      }

      const parsedEvent = await createdEvent.json();

      this.setState(
        {
          title: parsedEvent.data.createEvent.title,
          eventLocation: parsedEvent.data.createEvent.eventLocation,
          date: parsedEvent.data.createEvent.date
        },
        () => {
          let successTimeout = setTimeout(() => {
            this.setState({ showSuccess: false });
            this.props.history.push("/events");
          }, 3000);
          this.setState({ showSuccess: true, successTimeout: successTimeout });
        }
      );

      return parsedEvent;
    } catch (err) {
      throw err;
    }
  }

  componentWillUnmount() {
    const { successTimeout } = this.state;
    clearTimeout(successTimeout);
    this.setState({ successTimeout: null });
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const {
      title,
      eventImg,
      eventLocation,
      price,
      description,
      date,
      showSuccess
    } = this.state;

    return (
      <div className="create-event">
        <div className="create-event-form-wrapper">
          <h1>Create An Event</h1>
          <form
            onSubmit={this.createEvent.bind(this)}
            className="create-event-form"
          >
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Event Title"
              value={title}
              onChange={this.onInputChange}
            />
            <input
              type="text"
              name="eventLocation"
              id="location"
              placeholder="Location"
              value={eventLocation}
              onChange={this.onInputChange}
            />
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Price"
              value={price}
              onChange={this.onInputChange}
            />
            <input
              type="text"
              name="eventImg"
              id="eventImg"
              placeholder="Event Image"
              value={eventImg}
              onChange={this.onInputChange}
            />
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={this.onInputChange}
            />
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="4"
              value={description}
              onChange={this.onInputChange}
              placeholder="Event Description"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {showSuccess && (
          <Success
            title={title}
            eventLocation={eventLocation}
            date={new Date(date).toISOString()}
          />
        )}
      </div>
    );
  }
}

export default CreateEvent;
