import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="retrieve-dates"
// Using Stimulus Outlets to communicate with datepicker Stimulus controller
export default class extends Controller {
  static targets = ["datesDestination"]
  static outlets = ["datepicker"]
  connect() {
    console.log(this.element)

    // !!!IMPORTANT!!! About the next 3 lines of code
    // Used to get initial value
    // But now, it's not that necessary as in datepickr controller, when the page loads with pre-filled dates, the datepicker already automatically dispatches the nights-updated event
    // BUT just in case there is Race conditions
    // Which cause the retrieve-dates controller to connect BEFORE the datepicker controller finishes setting up, we keep this code
    if (this.hasDatepickerOutlet) {
      this.updateNights();
    }
  }

  datepickerOutletConnected(outlet, element) {
    console.log("Datepicker outlet connected:", outlet, element)
    this.updateNights();

    // !!!IMPORTANT!!!
    // Listen for custom event
    // We need bind(this) as JavaScript loses the context of "this" when we pass a function as a callback
    // Without bind(this), the "this" inside the #handleNightsUpdate function will be interpreted as the ELEMENT which trigger the event
    // And because the element doesn't have "datesDestinationTarget" attribute, "undefined" error will be raised
    element.addEventListener('nights-updated', this.handleNightsUpdate.bind(this));
  }
  // REACTIVELY receives the night value automatically when the event fires when user click on the calendar
  handleNightsUpdate(event) {
    const nights = event.detail.nights;
    this.datesDestinationTarget.textContent = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  }

  // PROACTIVELY get the initial/current value of nightsNum by using the outlet connection to call `getNightsNum()` method
  updateNights() {
    if (this.hasDatepickerOutlet) {
      const nights = this.datepickerOutlet.getNightsNum();
      this.datesDestinationTarget.textContent = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
    }
  }
}
