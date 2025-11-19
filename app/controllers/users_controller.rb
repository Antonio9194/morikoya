class UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    # Only allow users to update their own profile
    if current_user.update_with_password(user_params)
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
    # Require current password for security
    params.require(:user).permit(:email, :phone_number, :current_password)
  end
end
