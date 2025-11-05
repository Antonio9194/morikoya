class PaymentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_booking, only: %i[new create]

  def new
  end

  def create
    # Create a Stripe PaymentIntent
    payment_intent = Stripe::PaymentIntent.create({
                                                    amount: @booking.total_price_cents,
                                                    currency: 'jpy',
                                                    payment_method: params[:payment_method_id],
                                                    confirmation_method: 'manual',
                                                    confirm: true,
                                                    return_url: confirmation_booking_url(@booking),
                                                    metadata: {
                                                      booking_id: @booking.id,
                                                      user_id: current_user.id,
                                                      user_email: current_user.email
                                                    }
                                                  })

    # Update booking with payment information
    @booking.update(
      stripe_payment_intent_id: payment_intent.id,
      payment_status: 'paid',
      status: 'confirmed'
    )

    render json: {
      success: true,
      redirect_url: confirmation_booking_path(@booking)
    }
  rescue Stripe::CardError => e
    # Handle card errors (declined, insufficient funds, etc.)
    render json: { error: e.message }, status: :unprocessable_entity
  rescue Stripe::StripeError
    # Handle other Stripe errors
    render json: { error: 'Payment failed. Please try again.' },
           status: :unprocessable_entity
  end

  private

  def set_booking
    @booking = current_user.bookings.find(params[:booking_id])

    # Redirect if already paid
    return unless @booking.payment_status == 'paid'

    redirect_to confirmation_booking_path(@booking),
                alert: 'This booking has already been paid.'
  end
end
