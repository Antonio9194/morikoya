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

    // Track if payment was completed successfully
    this.paymentCompleted = false;

    // Add beforeunload listener to warn when leaving page
    this.beforeUnloadHandler = this.handleBeforeUnload.bind(this);
    window.addEventListener("beforeunload", this.beforeUnloadHandler);

    // Add Turbo navigation listener for internal navigation
    this.turboBeforeVisitHandler = this.handleTurboBeforeVisit.bind(this);
    document.addEventListener("turbo:before-visit", this.turboBeforeVisitHandler);
  }

  disconnect() {
    console.log("Stripe Payment controller disconnected");
    console.log("Payment completed status:", this.paymentCompleted);

    if (this.card) {
      this.card.unmount();
    }

    // Remove event listeners
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    document.removeEventListener("turbo:before-visit", this.turboBeforeVisitHandler);

    // Cancel booking if payment wasn't completed
    if (!this.paymentCompleted) {
      console.log("Payment not completed, cancelling booking...");
      this.cancelBooking();
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

  // Handle browser close/refresh warning
  handleBeforeUnload(event) {
    console.log("beforeunload event triggered, payment completed:", this.paymentCompleted);
    if (!this.paymentCompleted) {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
    }
  }

  // Handle internal navigation (Turbo navigation)
  handleTurboBeforeVisit(event) {
    console.log("turbo:before-visit event triggered, payment completed:", this.paymentCompleted);
    if (!this.paymentCompleted) {
      const confirmed = confirm(
        "You haven't completed your payment yet. If you leave this page, your booking will be cancelled. Are you sure you want to leave?"
      );
      if (!confirmed) {
        event.preventDefault();
      }
    }
  }

  // Cancel the booking via AJAX
  cancelBooking() {
    console.log("Cancelling booking:", this.bookingIdValue);
    const cancelUrl = `/bookings/${this.bookingIdValue}/cancel`;
    const csrfToken = this.getCsrfToken();

    // Use sendBeacon for reliable delivery even when page is closing
    // sendBeacon only supports POST method
    const formData = new FormData();
    formData.append('authenticity_token', csrfToken);

    if (navigator.sendBeacon) {
      console.log("Using sendBeacon to cancel booking");
      // sendBeacon sends as POST automatically
      const success = navigator.sendBeacon(cancelUrl, formData);
      console.log("sendBeacon result:", success);
    } else {
      // Fallback to fetch with keepalive
      console.log("Using fetch to cancel booking");
      fetch(cancelUrl, {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body: formData,
        keepalive: true,
      }).catch((error) => {
        console.error("Error cancelling booking:", error);
      });
    }
  }
}
