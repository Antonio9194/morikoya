import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    events: String
  }

  connect() {
    const calendarEl = this.element

    // Parse JSON string into a JS array
    const events = JSON.parse(this.eventsValue || "[]")

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      editable: false,
      events: events
    })

    calendar.render()
  }
}
