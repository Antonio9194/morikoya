import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="admin-dashboard"
export default class extends Controller {
  static targets = ["arrivals", "departures", "stayings"];

  showArrivals() {
    this.departuresTarget.style.display = "none";
    this.stayingsTarget.style.display = "none";
    this.arrivalsTarget.style.display = "block";
  }

  showDepartures() {
    this.arrivalsTarget.style.display = "none";
    this.stayingsTarget.style.display = "none";
    this.departuresTarget.style.display = "block";
  }

  showStayings() {
    this.arrivalsTarget.style.display = "none";
    this.departuresTarget.style.display = "none";
    this.stayingsTarget.style.display = "block";
  }
}
