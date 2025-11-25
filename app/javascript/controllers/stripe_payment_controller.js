// app/javascript/controllers/stripe_payment_controller.js

import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="stripe-payment"
export default class extends Controller {
  static targets = [
    "form",
    "cardElement",
    "cardErrors",
    "submitButton",
    "buttonText",
    "spinner",
  ];

  static values = {
    publishableKey: String,
    bookingId: Number,
  };

  connect() {
    console.log("Stripe Payment controller connected!");

    // Track if payment was successful
    this.paymentCompleted = false;

    // Add beforeunload listener to warn users (external navigation)
    this.beforeUnloadHandler = this.handleBeforeUnload.bind(this);
    window.addEventListener("beforeunload", this.beforeUnloadHandler);

    // Add Turbo navigation listener (internal navigation via Turbo)
    this.turboBeforeVisitHandler = this.handleTurboBeforeVisit.bind(this);
    document.addEventListener(
      "turbo:before-visit",
      this.turboBeforeVisitHandler
    );

    // Initialize Stripe with publishable key
    this.stripe = Stripe(this.publishableKeyValue);

    // Create Stripe Elements instance
    this.elements = this.stripe.elements();

    this.card = this.elements.create("card", {
      style: {
        base: {
          fontSize: "16px",
          color: "#32325d",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    });

    this.card.mount(this.cardElementTarget);

    this.card.on("change", (event) => {
      this.displayCardErrors(event);
    });
  }

  disconnect() {
    console.log("Stripe Payment controller disconnected");

    // Remove beforeunload listener
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);

    // Remove Turbo navigation listener
    document.removeEventListener(
      "turbo:before-visit",
      this.turboBeforeVisitHandler
    );

    // If payment wasn't completed, cancel the booking
    if (!this.paymentCompleted) {
      this.cancelBooking();
    }

    if (this.card) {
      this.card.unmount();
    }
  }

  handleBeforeUnload(event) {
    // Only show warning if payment hasn't been completed
    if (!this.paymentCompleted) {
      event.preventDefault();
      event.returnValue = ""; // Chrome requires returnValue to be set
      return ""; // For older browsers
    }
  }

  handleTurboBeforeVisit(event) {
    // Intercept Turbo navigation and show confirmation
    if (!this.paymentCompleted) {
      if (
        !confirm(
          "Are you sure you want to leave? Your booking will be cancelled."
        )
      ) {
        event.preventDefault();
      }
    }
  }

  async cancelBooking() {
    try {
      const response = await fetch(`/bookings/${this.bookingIdValue}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.getCsrfToken(),
        },
      });

      if (response.ok) {
        console.log("Booking cancelled successfully");
        const result = await response.json();
        // Redirect to room page with a full page reload to force the refresh to update the calendar
        if (result.room_id) {
          window.location.href = `/rooms/${result.room_id}`;
        }
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    console.log("Form submitted!");
    this.setLoadingState(true);

    try {
      // Create payment method with Stripe
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: "card",
        card: this.card,
      });

      if (error) {
        this.displayCardErrors({ error });
        this.setLoadingState(false);
        return;
      }

      console.log("Payment method created:", paymentMethod.id);

      // Send payment method to server
      await this.processPayment(paymentMethod.id);
    } catch (error) {
      console.error("Payment error:", error);
      this.cardErrorsTarget.textContent =
        "An unexpected error occurred. Please try again.";
      this.setLoadingState(false);
    }
  }

  // Send payment to server
  async processPayment(paymentMethodId) {
    try {
      const response = await fetch(this.formTarget.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.getCsrfToken(),
        },
        body: JSON.stringify({
          payment_method_id: paymentMethodId,
          booking_id: this.bookingIdValue,
        }),
      });

      const result = await response.json();

      if (result.error) {
        this.cardErrorsTarget.textContent = result.error;
        this.setLoadingState(false);
      } else if (result.success) {
        console.log("Payment successful! Redirecting...");
        // Mark payment as completed so booking won't be cancelled
        this.paymentCompleted = true;
        window.location.href = result.redirect_url;
      }
    } catch (error) {
      console.error("Server error:", error);
      this.cardErrorsTarget.textContent =
        "Failed to process payment. Please try again.";
      this.setLoadingState(false);
    }
  }

  // Display card validation errors
  displayCardErrors(event) {
    if (event.error) {
      this.cardErrorsTarget.textContent = event.error.message;
    } else {
      this.cardErrorsTarget.textContent = "";
    }
  }

  // Show/hide loading state
  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitButtonTarget.disabled = true;
      this.buttonTextTarget.classList.add("d-none");
      this.spinnerTarget.classList.remove("d-none");
    } else {
      this.submitButtonTarget.disabled = false;
      this.buttonTextTarget.classList.remove("d-none");
      this.spinnerTarget.classList.add("d-none");
    }
  }

  // Get CSRF token for Rails
  getCsrfToken() {
    const token = document.querySelector('[name="csrf-token"]');
    return token ? token.content : "";
  }
}
