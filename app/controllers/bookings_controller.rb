class BookingsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show]
  before_action :set_room, only: [:create]
  def index
  end

  def show
  end

  def create
    redirect_to new_user_session_path, alert: "You must be signed in to make a booking!" unless current_user

    if params[:booking][:start_date].blank?
      redirect_to room_path(@room), alert: "Please select a date before booking"
      return
    end

    dates_range = params[:booking][:start_date].split(" to ")
    @booking = Booking.new(
      start_date: dates_range.first,
      end_date: dates_range.last,
      user: current_user,
      room: @room
    )

    if @booking.save
      # Redirect to payment page instead of guest page
      redirect_to new_payment_path(booking_id: @booking.id),
                  notice: "Booking created! Please complete payment."
    else
      redirect_to room_path(@room),
                  alert: "Failed to make a booking. Please try again!",
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
      respond_to do |format|
        format.html { redirect_to room_path(@booking.room), notice: "Booking cancelled and returned to room page." }
        format.json { render json: { success: true, room_id: @booking.room_id }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { redirect_to confirmation_booking_path(@booking), alert: "Only pending bookings can be cancelled." }
        format.json { render json: { error: "Only pending bookings can be cancelled." }, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  end
end
