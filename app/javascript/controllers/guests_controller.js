import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "numberOfGuests",
    "count",
    "guestsParam",
    "guestsValue",
    "guestsInput",
  ];

  connect() {
    if (this.hasGuestsParamTarget) {
      this.guestCount = parseInt(this.guestsParamTarget.textContent, 10);
      this.updateDisplay();
    } else {
      this.guestCount = parseInt(this.guestsInputTarget.value || 1, 10);
      this.updateDisplay();
    }
    return this.guestCount;
  }

  open() {
    this.numberOfGuestsTarget.classList.toggle("d-none");
    this.guestsValueTarget.classList.remove("d-none");
  }

  increase() {
    this.guestCount++;
    this.updateDisplay();
  }

  decrease() {
    if (this.guestCount > 1) this.guestCount--;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.hasCountTarget) {
      this.countTarget.textContent = this.guestCount;
    }
    if (this.hasGuestsParamTarget) {
      this.guestsParamTarget.textContent = this.guestCount;
    }
    if (this.hasGuestsValueTarget) {
      this.guestsValueTarget.textContent = this.guestCount;
    }
    if (this.hasGuestsInputTarget) {
      this.guestsInputTarget.value = this.guestCount;
    }
  }
}
