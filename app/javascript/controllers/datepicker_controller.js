import { Controller } from "@hotwired/stimulus";
import flatpickr from "flatpickr";

import "flatpickr/dist/l10n/ja.js"
import "flatpickr/dist/l10n/ko.js"
import "flatpickr/dist/l10n/zh.js"

// Connects to data-controller="datepicker"
export default class extends Controller {
  static values = {
    currentBookings: Array,
    locale: String
  };

  connect() {

    console.log(this.element, this.localeValue);

    const lookupKey = (this.localeValue === "zh-CN" || this.localeValue === "zh-TW") ? "zh" : this.localeValue;
    const selectedLocale = flatpickr.l10ns[lookupKey] || "default";

    console.log("Checking flatpickr l10ns:", flatpickr.l10ns)
    console.log("Selected Locale:", selectedLocale)

    const initialDates = this.element.value.split(" - ");

    const now = new Date();
    this.fpickr = flatpickr(this.element, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: this.defineAltDateFormat(),
      mode: "range",
      minDate: "today",
      disable: this.currentBookingsValue,
      // To overwrite the default range separator of Flatpickr from " to " -> " - "
      locale: {
        ...selectedLocale,
        rangeSeparator: " - ",
      },
      // "onChange" is the Flatpickr configuration option, fires every time the user picks or changes dates
      // When passing the function to Flatpickr, it will lose the Stimulus controller's "this" context.
      // "bind(this)"" permanently attaches the correct "this"
      onChange: this.update.bind(this),
    });
    if (initialDates.length === 2) {
      this.nightsNum =
        (new Date(initialDates[1]) - new Date(initialDates[0])) / 86400000;
      console.log(this.nightsNum);
      // Dispatch initial event
      this.dispatchNightsUpdate();
    }
  }

  update(selectedDates, dateStr) {
    // selectedDates = array of JS Dates
    // dateStr = string in the input (e.g., "2025-01-01 - 2025-01-05")
    // Both the above variables are supplied Flatpickr automatically when it calls the update method

    console.log("Selected Dates:", selectedDates);
    console.log("Date Range String:", dateStr);
    const datesArray = dateStr.split(" - ");

    // Calculate the num of nights
    if (datesArray.length === 2) {
      this.nightsNum =
        (new Date(datesArray[1]) - new Date(datesArray[0])) / 86400000;
      console.log(this.nightsNum);
      // Dispatch event when dates change
      this.dispatchNightsUpdate();
    }
  }

  /// !!! IMPORTANT !!!
  // Add this method to expose nightsNum as it is a variable stored INSIDE the datepicker controller
  // Other controllers (like retrieve-dates) can't directly access variables inside another controller - they're "private" by default
  getNightsNum() {
    return this.nightsNum || 0;
  }

  /// !!! IMPORTANT !!!
  // Add this method to dispatch custom event (allows us to simulate the (custom) event on the element)
  // Bubbling means when an event happens on an HTML element, it travel bottom to top
  // the event starts at the target element and travels UP to its parents through the DOM tree
  // This method makes sure when there is a nights-updated event happen in flatpickr, the change will be broadcasted through the DOM tree
  // and get to element where the retrieve-dates controller is mounted on
  dispatchNightsUpdate() {
    this.element.dispatchEvent(
      new CustomEvent("nights-updated", {
        detail: { nights: this.nightsNum },
        bubbles: true,
      })
    );
  }

  defineAltDateFormat() {
    const locale = this.localeValue;

    if (locale === "ja" || locale === "zh-CN" || locale === "zh-TW") {
      return "Y年m月d日";
    }
    else if (locale === "ko") {
      return "Y년 m월 d일";
    }
    else {
      return "d M Y";
    }
  }
}
