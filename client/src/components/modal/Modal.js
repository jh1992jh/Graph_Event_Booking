import React from "react";

const Modal = ({
  children,
  canCancel,
  canConfirm,
  canCancelDetails,
  canBook,
  bookEvent,
  eventId,
  showModal,
  createEvent,
  title
}) => {
  return (
    <div className="modal-background">
      <div className="modal">
        <header className="modal-header">
          <h3>{title}</h3>
        </header>
        <section className="modal-content">{children}</section>
        <section className="modal-actions">
          {canConfirm && <button onClick={() => createEvent()}>Confirm</button>}
          {canCancel && <button onClick={() => showModal()}>Cancel</button>}
          {canBook && (
            <button
              onClick={() => {
                bookEvent(eventId);
                showModal(false);
              }}
            >
              Book event
            </button>
          )}
          {canCancelDetails && (
            <button onClick={() => showModal(false)}>Cancel</button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Modal;
