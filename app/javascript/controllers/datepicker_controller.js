import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr";

// Connects to data-controller="datepicker"
export default class extends Controller {
  static values = {
    currentBookings: Array
  }
  
  connect() {
    console.log("Datepicker controller connected")
    console.log("Current bookings:", this.currentBookingsValue)
    
    // Check if this page was restored from Turbo cache
    if (document.documentElement.hasAttribute("data-turbo-preview")) {
      console.log("Page loaded from Turbo cache, forcing reload...")
      window.location.reload()
      return
    }
    
    this.initializeFlatpickr()
  }
  
  disconnect() {
    // Clean up flatpickr instance
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy()
    }
  }
  
  initializeFlatpickr() {
    console.log(this.element)
    const now = new Date()
    this.flatpickrInstance = flatpickr(this.element, {
      dateFormat: "Y-m-d",
      mode: "range",
      minDate: "today",
      disable: this.currentBookingsValue
    })
  }

}
