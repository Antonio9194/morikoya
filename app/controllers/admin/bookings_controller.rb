class Admin::BookingsController < ApplicationController
  def index
    @rooms = Room.order(created_at: :asc).includes(bookings: :user)
  end

  def show
    @booking = Booking.find(params[:id])
  end

  def destroy
  end
end
