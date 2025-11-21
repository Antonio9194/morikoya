import { Controller } from "@hotwired/stimulus";
import flatpickr from "flatpickr";

// Connects to data-controller="datepicker"
export default class extends Controller {
  static values = {
    currentBookings: Array,
  };
  connect() {
    console.log(this.element);
    const now = new Date();
    flatpickr(this.element, {
      dateFormat: "Y-m-d",
      mode: "range",
      minDate: "today",
      disable: this.currentBookingsValue,
    });
  }
}
