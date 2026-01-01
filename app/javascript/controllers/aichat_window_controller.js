import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="aichat-window"
export default class extends Controller {
  static targets = ["chatWindow", "avatar"]

  connect() {
    console.log("I toggle ai chat window!")
  }

  open() {
    this.chatWindowTarget.classList.remove("d-none");
    this.avatarTarget.classList.add("d-none");
  }

  close() {
    this.chatWindowTarget.classList.add("d-none");
    this.avatarTarget.classList.remove("d-none");
  }
}
