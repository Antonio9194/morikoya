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

  // added logic in stimulus controller to change the date format shown in the checkin and checkout values update which refers to the search bars in homepage and rooms
  formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  updateValue(event) {
    const date = event.currentTarget.dataset.day;
    const clickedEl = event.currentTarget;
    const today = new Date().toISOString().split("T")[0];

    // prevent selecting past dates
    if (date < today) return;

    // if two dates are already selected, start a fresh selection
    if (this.datesSelected.length >= 2) {
      this.datesSelected = [];
      this.checkInValueTarget.textContent = "";
      this.checkOutValueTarget.textContent = "";
      this.checkInInputTarget.value = "";
      this.checkOutInputTarget.value = "";

      this.calendarTarget
        .querySelectorAll(".selected-date, .in-range")
        .forEach((el) => el.classList.remove("selected-date", "in-range"));
    }

    // add new pick
    this.datesSelected.push(date);

    // first pick -> mark as tentative check-in
    if (this.datesSelected.length === 1) {
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

    // second pick -> finalize start/end (prevent same-day selection)
    if (this.datesSelected.length === 2) {
      const first = this.datesSelected[0];
      const second = this.datesSelected[1];

      // prevent check-in and check-out being the same day
      if (first === second) {
        // keep only the first selection and ignore the second click
        this.datesSelected = [first];
        return;
      }

      // order start/end reliably (ISO dates compare lexically)
      const [start, end] =
        first.localeCompare(second) <= 0 ? [first, second] : [second, first];

      this.datesSelected = [start, end];

      // update inputs/labels
      this.checkInValueTarget.textContent = this.formatDate(start);
      this.checkInInputTarget.value = start;
      this.checkOutValueTarget.textContent = this.formatDate(end);
      this.checkOutInputTarget.value = end;

      // clear previous highlights then mark endpoints + range
      this.calendarTarget
        .querySelectorAll(".selected-date, .in-range")
        .forEach((el) => el.classList.remove("selected-date", "in-range"));

      this.calendarTarget.querySelectorAll("[data-day]").forEach((el) => {
        const d = el.dataset.day;
        if (d === start || d === end) {
          el.classList.add("selected-date");
        } else if (d > start && d < end) {
          el.classList.add("in-range");
        }
      });

      // close after 2nd valid pick
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
