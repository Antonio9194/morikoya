// app/javascript/controllers/calendar_controller.js
import { Controller } from "@hotwired/stimulus"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

// import CSS so the calendar is styled (see Step 3 where to place these)
import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"

export default class extends Controller {
  connect() {
    // render the calendar inside the element this controller is attached to
    const calendar = new Calendar(this.element, {
      plugins: [ dayGridPlugin, interactionPlugin ],
      initialView: "dayGridMonth",
      selectable: true,
      editable: true,
      events: [
        // sample events — you'll replace this with your backend later
        { title: "Booked — Room A", start: "2025-11-10", end: "2025-11-12" },
        { title: "Booked — Room B", start: "2025-11-15" }
      ]
    })

    calendar.render()
    this.calendar = calendar
  }

  disconnect() {
    if (this.calendar) this.calendar.destroy()
  }
}
