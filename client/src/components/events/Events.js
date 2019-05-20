import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
// import Modal from "../modal/Modal";
import EventList from "./EventList";
import SearchEvents from "./SearchEvents";
import NextEvent from "./NextEvent";

class Events extends Component {
  state = {
    title: "",
    price: "",
    description: "",
    date: "",
    eventImg: "",
    eventLocation: "",
    searchInput: "",
    searchBy: "title",
    events: [],
    showModal: false,
    loading: false
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    this.setState({ loading: true });
    const reqBody = {
      query: `
      query {
          events {
              _id
              title
              description
              eventLocation
              eventImg
              price
              date
              user {
                _id
                username
                email
              }
          }
      }
      
    `
    };

    fetch(process.env.REACT_APP_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Fething of the events failed, try again.");
        }

        return res.json();
      })
      .then(resData => {
        let eventsArr = [];
        resData.data.events.forEach(event => {
          if (event.date > new Date().toISOString()) {
            eventsArr.push(event);
          }
        });

        this.setState({ events: eventsArr, loading: false });
        return resData;
      })
      .catch(err => console.log(err));
  };
  createEvent = () => {
    const {
      title,
      description,
      price,
      date,
      eventImg,
      eventLocation
    } = this.state;
    const token = this.context.token;
    const isInvalid =
      title.trim().length === 0 ||
      price === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0 ||
      eventLocation.trim().length === 0;

    if (isInvalid) {
      return;
    }

    const reqBody = {
      query: `
      mutation {
        createEvent(eventInput: {title: "${title}", 
          description: "${description}", 
          price: ${parseFloat(price)}, date: "${date}", 
          eventImg: "${eventImg}", 
          eventLocation: "${eventLocation}"
        }) {
          _id
          title
          description
          price
          date
          eventImg
          eventLocation
          user {
            _id
            username
            email
          }
        }
      }
      
      `
    };

    fetch(process.env.REACT_APP_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating an event failed, try again.");
        }

        return res.json();
      })
      .then(resData => {
        this.showModal();
        this.setState(prevState => {
          return { events: prevState.events.concat(resData.data.createEvent) };
        });
      })
      .catch(err => console.log(err));
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  showModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };
  render() {
    const {
      /* title,
      description,
      price,
      date,
      eventImg,
      showModal,
      eventLocation,*/
      searchInput,
      searchBy,
      events,
      loading
    } = this.state;

    const filteredEvents = events.filter(event => {
      return event[searchBy].toLowerCase().includes(searchInput.toLowerCase());
    });

    filteredEvents.sort((date1, date2) => {
      return new Date(date1.date) - new Date(date2.date);
    });

    let displayEvents;

    if (events.length > 0 && !loading) {
      displayEvents = (
        <EventList
          events={filteredEvents}
          authUser={this.context.userId}
          token={this.context.token}
        />
      );
    } else if (events.length === 0 && loading) {
      displayEvents = <h3>Loading</h3>;
    } else if (events.length === 0 && !loading) {
      displayEvents = <p>There are no upcoming events at the moment.</p>;
    }
    return (
      <div className="events">
        <SearchEvents
          searchInput={searchInput}
          onInputChange={this.onInputChange}
        />
        <div className="displayed-events">
          <section className="events-section">{displayEvents}</section>
          {events.length !== 0 && <NextEvent events={events} />}
        </div>
      </div>
    );
  }
}

export default Events;
