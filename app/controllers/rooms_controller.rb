class RoomsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_room, only: [:show]
  def index
    @rooms = Room.all

    if search_params[:check_in].present? && search_params[:check_out].present?
      check_in = Date.parse(search_params[:check_in])
      check_out = Date.parse(search_params[:check_out])

      # Find rooms that have overlapping bookings
      booked_room_ids = Booking.where("start_date < ? AND end_date > ?", check_out, check_in).pluck(:room_id)

      # Exclude those rooms
      @rooms = @rooms.where.not(id: booked_room_ids)
    end

    # Guest count
    if search_params[:guests].present?
      @guest_num = search_params[:guests].to_i
      room_capacity = @rooms.map(&:capacity).sum
      @rooms = room_capacity >= search_params[:guests].to_i ? @rooms : []
    end
    if @rooms.empty?
      redirect_to root_path, alert: "No rooms available for your dates"
    end
  end
  def show
    @booking = Booking.new
  end

  private

  def room_params
    params.require(:room).permit(:name, :description, :price_per_night, :size, :beds, :capacity, :amenities)
  end

  def search_params
    params.permit(:query, :check_in, :check_out, :guests)
  end

  def set_room
    @room = Room.find(params[:id])
  end
end
