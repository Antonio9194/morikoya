import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="conditional-display"
// Using Stimulus Outlets to communicate with datepicker Stimulus controller
export default class extends Controller {
  static targets = ["pricePerNight", "totalPrice"]
  static outlets = ["datepicker"]

  connect() {
    console.log(this.element, "Calculate and display total price dynamically.")

    // !!!IMPORTANT!!! About the next 3 lines of code
    // Used to get initial value
    // But now, it's not that necessary as in datepickr controller, when the page loads with pre-filled dates, the datepicker already automatically dispatches the nights-updated event
    // BUT just in case there is Race conditions
    // Which cause the total-price-display controller to connect BEFORE the datepicker controller finishes setting up, we keep this code
    if (this.hasDatepickerOutlet) {
      this.updateTotalPrice();
    }
  }

  datepickerOutletConnected(outlet, element) {
    console.log("Datepicker outlet connected:", outlet, element)
    this.updateTotalPrice();

    // !!!IMPORTANT!!!
    // Listen for custom event
    // We need bind(this) as JavaScript loses the context of "this" when we pass a function as a callback
    // Without bind(this), the "this" inside the #handleTotalPriceUpdate function will be interpreted as the ELEMENT which trigger the event
    // And because the element doesn't have "totalPriceTarget" attribute, "undefined" error will be raised
    element.addEventListener('nights-updated', this.handleTotalPriceUpdate.bind(this));
  }
  // REACTIVELY receives the night value automatically when the event fires when user click on the calendar
  handleTotalPriceUpdate(event) {
    const nights = event.detail.nights;

    //using regex to parse the integer from price per night
    const pricePerNight = parseInt(this.pricePerNightTarget.textContent.replace(/\D/g, ""), 10);

    this.totalPriceTarget.textContent = `¥${Intl.NumberFormat('en-US').format(nights * pricePerNight)}`;

    if (nights > 0 && this.element.classList.contains("d-none")) {
      this.element.classList.remove("d-none");
    }
  }

  // PROACTIVELY get the initial/current value of nightsNum by using the outlet connection to call `getNightsNum()` method
  updateTotalPrice() {
    if (this.hasDatepickerOutlet) {
      const nights = this.datepickerOutlet.getNightsNum();

      //using regex to parse the integer from price per night
      const pricePerNight = parseInt(this.pricePerNightTarget.textContent.replace(/\D/g, ""), 10);

      this.totalPriceTarget.textContent = `¥${Intl.NumberFormat('en-US').format(nights * pricePerNight)}`;

      if (nights === 0) {
        this.element.classList.add("d-none");
      }
      if (nights > 0 && this.element.classList.contains("d-none")) {
        this.element.classList.remove("d-none");
      }
    }
  }
}
