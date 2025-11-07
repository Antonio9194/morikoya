// app/javascript/controllers/calendar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const calendarEl = this.element

    // Use the global FullCalendar object from CDN
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      editable: true,
      events: [
        { title: "Meeting", start: new Date() }
      ]
    })

    calendar.render()
  }
}
