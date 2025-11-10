import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    events: String,
  };

  connect() {
    const calendarEl = this.element;

    // Parse JSON string into a JS array
    const events = JSON.parse(this.eventsValue || "[]");

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      editable: false,
      events: events,
      eventClick: (info) => {
        const bookingId = info.event.id;
        const modal = document.getElementById(`bookingModal-${bookingId}`);
        if (modal) {
          const bsModal = new bootstrap.Modal(modal, { backdrop: false });
          bsModal.show();
        }

        const deleteModal = document.getElementById(
          `deleteBookingModal-${bookingId}`
        );
        if (deleteModal) {
          new bootstrap.Modal(deleteModal, { backdrop: false });
        }
      },
    });

    calendar.render();
  }
}
