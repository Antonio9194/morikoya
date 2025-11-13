class GuestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def show
  end

  def update
    if @user.update(user_params)
      # Optionally: Send confirmation email if email changed
      # UserMailer.email_changed_notification(@user).deliver_later if @user.email_previously_changed?
      
      render json: { 
        success: true, 
        message: 'Profile updated successfully',
        user: {
          email: @user.email,
          phone_number: @user.phone_number
        }
      }
    else
      render json: { 
        success: false, 
        errors: @user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = current_user
  end

  def user_params
    params.require(:user).permit(:email, :phone_number)
  end
end
