import React from "react";

const SearchEvents = ({ searchInput, onInputChange, searchBy }) => (
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
      onChange={e => onInputChange(e)}
    />
    <div className="searchterm">
      <label htmlFor="searchBy">Search By</label>
      <select
        className="searchBy"
        name="searchBy"
        value={searchBy}
        onChange={e => onInputChange(e)}
        id="searchBy"
      >
        <option value="title">Title</option>
        <option value="eventLocation">Location</option>
      </select>
    </div>
  </div>
);

export default SearchEvents;
