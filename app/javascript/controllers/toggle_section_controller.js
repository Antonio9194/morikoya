import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "icon"]

  connect() {
    // Optional: Open the first section by default, or all closed
    // this.open()
  }

  toggle() {
    if (this.contentTarget.style.maxHeight) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.contentTarget.style.maxHeight = this.contentTarget.scrollHeight + "px"
    this.contentTarget.classList.add("active")
    this.iconTarget.style.transform = "rotate(180deg)"
  }

  close() {
    this.contentTarget.style.maxHeight = null
    this.contentTarget.classList.remove("active")
    this.iconTarget.style.transform = "rotate(0deg)"
  }
}
