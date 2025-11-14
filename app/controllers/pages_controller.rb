class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[home about_us faqs]

  require 'date'

  def home
    @bookings = Booking.all
    @arrivals = @bookings.where(start_date: (Date.today..Date.today + 2)).order(start_date: :asc)
    @departures = @bookings.where(end_date: (Date.today..Date.today + 2)).order(end_date: :asc)
  end

  def about_us
  end

  def faqs
  end
end
