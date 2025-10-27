import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "calendar",
    "checkInValue",
    "checkOutValue",
    "checkInInput",
    "checkOutInput",
    "monthsWrapper",
  ];

  connect() {
    this.currentIndex = 0;
    this.datesSelected = []; // store chosen dates
    this.showMonths();
    this.markPastDays(); // new: mark past days visually on load
  }

  open() {
    this.calendarTarget.classList.toggle("d-none");
  }

  // --- mark past days ---
  markPastDays() {
    const today = new Date().toISOString().split("T")[0];
    this.calendarTarget.querySelectorAll("[data-day]").forEach((el) => {
      if (el.dataset.day < today) {
        el.classList.add("past"); // add class for styling
      }
    });
  }

  updateValue(event) {
    const date = event.currentTarget.dataset.day;
    const clickedEl = event.currentTarget;
    const today = new Date().toISOString().split("T")[0];

    // prevent selecting past dates
    if (date < today) {
      return;
    }

    // clear highlights if 2 dates already selected
    if (this.datesSelected.length >= 2) {
      this.datesSelected = [];
      this.checkInValueTarget.textContent = "";
      this.checkOutValueTarget.textContent = "";
      this.checkInInputTarget.value = "";
      this.checkOutInputTarget.value = "";

      // remove all highlights
      this.calendarTarget
        .querySelectorAll(".selected-date, .in-range")
        .forEach((el) => {
          el.classList.remove("selected-date", "in-range");
        });
    }

    // add new selection
    this.datesSelected.push(date);

    // if first pick, set check-in
    if (this.datesSelected.length === 1) {
      // ensure only the clicked element is marked
      this.calendarTarget
        .querySelectorAll(".selected-date")
        .forEach((el) => el.classList.remove("selected-date"));
      clickedEl.classList.add("selected-date");

      this.checkInValueTarget.textContent = date;
      this.checkInInputTarget.value = date;
      this.checkOutValueTarget.textContent = "";
      this.checkOutInputTarget.value = "";
      return;
    }

    // second pick: determine ordered start/end and update UI accordingly
    if (this.datesSelected.length === 2) {
      const [start, end] = this.datesSelected.slice().sort();
      // store ordered selection
      this.datesSelected = [start, end];

      // set inputs/labels to ordered values (so check-in is always earlier)
      this.checkInValueTarget.textContent = start;
      this.checkInInputTarget.value = start;
      this.checkOutValueTarget.textContent = end;
      this.checkOutInputTarget.value = end;

      // clear previous highlights then mark endpoints + range
      this.calendarTarget
        .querySelectorAll(".selected-date, .in-range")
        .forEach((el) => {
          el.classList.remove("selected-date", "in-range");
        });

      this.calendarTarget.querySelectorAll("[data-day]").forEach((el) => {
        const d = el.dataset.day;
        if (d === start || d === end) {
          el.classList.add("selected-date");
        } else if (d > start && d < end) {
          el.classList.add("in-range");
        }
      });

      // close after 2nd pick
      this.calendarTarget.classList.add("d-none");
    }
  }

  // --- months navigation ---
  showMonths() {
    const months = this.monthsWrapperTarget.children;
    Array.from(months).forEach((m, i) => {
      m.style.display =
        i === this.currentIndex || i === this.currentIndex + 1
          ? "block"
          : "none";
    });
  }

  nextMonth() {
    if (this.currentIndex < this.monthsWrapperTarget.children.length - 2) {
      this.currentIndex++;
      this.showMonths();
    }
  }

  prevMonth() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showMonths();
    }
  }
}
