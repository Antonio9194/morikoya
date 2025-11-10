class Admin::BookingsController < ApplicationController
  def index
    @rooms = Room.order(created_at: :asc).includes(bookings: :user)
  end

  def show
    @booking = Booking.find(params[:id])
  end

  def destroy
    @booking = Booking.find(params[:id])
    if @booking.destroy
      redirect_to admin_bookings_path
    else
      redirect_to admin_bookings_path, alert: 'Something went wrong...'
    end
  end
end
