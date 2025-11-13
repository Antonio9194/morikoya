class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[home about_us faqs]

  require 'date'

  def home
    @bookings = Booking.all
    @next_checkins = @bookings.where(start_date: (Date.today..Date.today + 2)).order(start_date: :asc)
  end

  def about_us
  end

  def faqs
  end
end
