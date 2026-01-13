import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="retrieve-dates"
// Using Stimulus Outlets to communicate with datepicker Stimulus controller
export default class extends Controller {
  static targets = ["nightsNumDestination"];
  static outlets = ["datepicker"];

  connect() {
    console.log(
      this.element,
      "Calculate and display number of nights dynamically."
    );

    // Get initial value if datepicker already has dates
    if (this.hasDatepickerOutlet) {
      this.updateNights();
    }
  }

  datepickerOutletConnected(outlet, element) {
    console.log("Datepicker outlet connected:", outlet, element);
    this.updateNights();

    // Listen for the event dispatched by datepicker controller
    element.addEventListener(
      "nights-updated",
      this.handleNightsUpdate.bind(this)
    );
  }

  // Reactively update when user picks dates
  handleNightsUpdate(event) {
    const nights = event.detail.nights;
    const labelTemplate =
      this.nightsNumDestinationTarget.dataset.retrieveDatesLabel;

    this.nightsNumDestinationTarget.textContent = `${nights} ${labelTemplate}`;

    if (nights > 0 && this.element.classList.contains("d-none")) {
      this.element.classList.remove("d-none");
    }
  }

  // Proactively fill on page load
  updateNights() {
    if (this.hasDatepickerOutlet) {
      const nights = this.datepickerOutlet.getNightsNum();
      const labelTemplate =
        this.nightsNumDestinationTarget.dataset.retrieveDatesLabel;

      this.nightsNumDestinationTarget.textContent = `${nights} ${labelTemplate}`;

      if (nights === 0) {
        this.element.classList.add("d-none");
      }
    }
  }
}
