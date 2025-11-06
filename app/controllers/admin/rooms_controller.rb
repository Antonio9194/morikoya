module Admin
  class RoomsController < ApplicationController
    before_action :set_room, only: %i[show edit update destroy]
    before_action :authenticate_user! # only admins can access (optional)

    def index
      @rooms = Room.all
    end

    def show
    end

    def edit
      @room = Room.find(params[:id])
    end

    def update
      if @room.update(room_params)
        redirect_to rooms_path, notice: 'Room updated successfully.'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      if @room.bookings.present?
        redirect_to rooms_path, alert: 'Cannot delete room with active bookings!'
      else
        @room.destroy
        redirect_to rooms_path, notice: 'Room deleted successfully.'
      end
    end

    private

    def set_room
      @room = Room.find(params[:id])
    end

    def room_params
      params.require(:room).permit(:name, :description, :price_per_night, :capacity, :amenities, :bunk, :double,
                                   :sofa_bed)
    end
  end
end
