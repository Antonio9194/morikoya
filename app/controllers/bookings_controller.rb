class BookingsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show]
  before_action :set_room, only: [:create]
  def index
  end

  def show
  end

  def create
    redirect_to new_user_session_path, alert: 'You must be signed in to make a booking!' unless current_user

    if params[:booking][:start_date].blank?
      redirect_to room_path(@room), alert: 'Please select a date before booking'
      return
    end

    dates_range = params[:booking][:start_date].split(' - ')
    @booking = Booking.new(
      start_date: dates_range.first,
      end_date: dates_range.last,
      user: current_user,
      room: @room
    )

    if @booking.save
      # Schedule auto-cancellation after 30 minutes if payment not completed
      CancelUnpaidBookingJob.set(wait: 30.minutes).perform_later(@booking.id)

      # Redirect to payment page instead of guest page
      redirect_to new_payment_path(booking_id: @booking.id),
                  notice: 'Please complete payment.'
    else
      redirect_to room_path(@room),
                  alert: 'Failed to make a booking. Please try again!',
                  status: :unprocessable_entity
    end
  end

  def confirmation
    @booking = current_user.bookings.find(params[:id])

    # Redirect if not paid yet
    return if @booking.payment_status == 'paid'

    redirect_to new_payment_path(booking_id: @booking.id),
                alert: 'Please complete payment first.'
  end

  def cancel
    @booking = current_user.bookings.find(params[:id])
    if @booking.status == 'pending'
      @booking.update(status: 'cancelled')

      # Handle AJAX requests differently
      respond_to do |format|
        format.html { redirect_to room_path(@booking.room), notice: 'Booking cancelled and returned to room page.' }
        format.json { head :ok }
        format.any { head :ok }  # For sendBeacon requests
      end
    else
      respond_to do |format|
        format.html { redirect_to confirmation_booking_path(@booking), alert: 'Only pending bookings can be cancelled.' }
        format.json { head :unprocessable_entity }
        format.any { head :unprocessable_entity }
      end
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  end
end
