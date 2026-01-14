import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="ai-question-form"
export default class extends Controller {
  connect() {
    console.log("reset");
  }

  reset() {
    console.log(this.element);
    this.element.reset();
  }
}
