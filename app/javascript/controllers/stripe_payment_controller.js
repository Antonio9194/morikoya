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
  }

  disconnect() {
    console.log("Stripe Payment controller disconnected");

    if (this.card) {
      this.card.unmount();
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
