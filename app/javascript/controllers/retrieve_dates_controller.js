import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="retrieve-dates"
export default class extends Controller {
  static targets = ["chosenDates"]
  connect() {
    console.log(this.element)
    console.log(this.chosenDatesTarget.value)
  }
}
