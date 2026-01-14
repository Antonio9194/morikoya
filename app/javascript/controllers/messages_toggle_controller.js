import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="messages-toggle"
export default class extends Controller {
  static targets = [
    "messagesList",
    "placeholderText",
    "collapseIcon",
    "expandIcon",
  ];

  connect() {
    console.log("I will toggle messages list display.");
  }

  expand() {
    this.placeholderTextTarget.classList.toggle("d-none");
    this.messagesListTarget.classList.toggle("d-none");
    this.collapseIconTarget.classList.toggle("d-none");
    this.expandIconTarget.classList.toggle("d-none");
    this.expandIconTarget.style.background = "#8A3324";
    this.expandIconTarget.style.borderColor = "#ffffffff";
  }

  collapse() {
    this.placeholderTextTarget.classList.toggle("d-none");
    this.messagesListTarget.classList.toggle("d-none");
    this.collapseIconTarget.classList.toggle("d-none");
    this.expandIconTarget.classList.toggle("d-none");
  }
}
