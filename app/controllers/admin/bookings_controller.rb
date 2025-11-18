class Admin::BookingsController < ApplicationController
  def index
    @rooms = Room.order(created_at: :asc).includes(bookings: :user)
  end

  def show
    @booking = Booking.find(params[:id])
  end

  def destroy
    @booking = Booking.find(params[:id])
    if @booking.stripe_payment_intent_id.present?
      begin
        Stripe::Refund.create(payment_intent: @booking.stripe_payment_intent_id)
        @booking.update(status: 'cancelled')
        @booking.destroy
        redirect_to admin_bookings_path, notice: 'Booking cancelled and refunded successfully!'
      rescue Stripe::StripeError => e
        redirect_to admin_bookings_path, alert: "Refund failed: #{e.message}"
      end
    else
      @booking.destroy
      redirect_to admin_bookings_path, notice: 'Booking cancelled without refund.'
    end
  end
end
