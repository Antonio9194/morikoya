import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["answer"]

  toggle(event) {
    const question = event.currentTarget
    const answer = question.nextElementSibling

    answer.classList.toggle("d-none")
  }
}