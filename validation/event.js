const Validator = require("validator");

module.exports = eventValidation = (
  title,
  description,
  date,
  eventImg,
  eventLocation
) => {
  if (Validator.isEmpty(title.trim())) {
    throw new Error("Event Title is required");
  }

  if (Validator.isEmpty(description.trim())) {
    throw new Error("Event Description is required");
  }

  if (Validator.isEmpty(date)) {
    throw new Error("Event Date is required");
  }

  if (!Validator.isEmpty(eventImg)) {
    if (!Validator.isURL(eventImg)) {
      throw new Error("Enter a proper Image URL");
    }
  }

  if (Validator.isEmpty(eventLocation)) {
    throw new Error("Event Location is required");
  }
};
