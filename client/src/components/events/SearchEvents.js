import React from "react";

const SearchEvents = ({
  searchInput,
  setSearchEvents,
  searchBy,
  setSearchBy,
  events,
  setFilteredEvents
}) => {
  const searchEvents = e => {
    setSearchEvents(e.target.value);
    const filteredEvents = events.filter(event => {
      return event[searchBy].toLowerCase().includes(searchInput.toLowerCase());
    });

    if (searchInput.trim().length === 0) {
      setFilteredEvents([]);
    }
    if (searchInput.trim().length >= 2 && filteredEvents.length > 0) {
      setFilteredEvents(filteredEvents);
    } else {
      setFilteredEvents(events);
    }
  };
  /*const sortedEvents = filteredevents.sort((date1, date2) => {
    return new Date(date1.date) - new Date(date2.date);
  });*/

  return (
    <div className="search-events">
      <div className="icon">
        <i className="fas fa-search" />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search Events"
        name="searchInput"
        value={searchInput}
        onChange={e => searchEvents(e)}
      />
      <div className="searchterm">
        <label htmlFor="searchBy">Search By</label>
        <select
          className="searchBy"
          name="searchBy"
          value={searchBy}
          onChange={e => setSearchBy(e.target.value)}
          id="searchBy"
        >
          <option value="title">Title</option>
          <option value="eventLocation">Location</option>
        </select>
      </div>
    </div>
  );
};

export default SearchEvents;
