class LocalesController < ApplicationController
  skip_before_action :authenticate_user!, only: :update
  def update
    session[:locale] = params[:locale]
    redirect_back fallback_location: root_path
  end
end
