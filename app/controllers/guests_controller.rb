class GuestsController < ApplicationController
  before_action :authenticate_user!

  def show
  end

  def update
    if current_user.update(user_params)
      render json: { 
        success: true, 
        message: 'Profile updated successfully',
        user: {
          email: current_user.email,
          phone_number: current_user.phone_number
        }
      }
    else
      render json: { 
        success: false, 
        errors: current_user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :phone_number)
  end
end
