class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[home about_us faqs]

  def home
  end

  def about_us
  end

  def faqs
  end
end
