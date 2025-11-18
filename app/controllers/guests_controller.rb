class GuestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def show
  end

  def update
    if @user.update(user_params)
      respond_to do |format|
        format.turbo_stream do
          flash.now[:notice] = 'Profile updated successfully'
          render turbo_stream: [
            turbo_stream.update("profile_alerts", partial: "shared/flash_alert", locals: { type: "success", message: "Profile updated successfully" }),
            turbo_stream.update("user_email_display", plain: @user.email),
            turbo_stream.update("user_phone_display", plain: @user.phone_number || "Not provided")
          ]
        end
        format.html { redirect_to guest_path(@user), notice: 'Profile updated successfully' }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.update("profile_form", partial: "guests/profile_form", locals: { user: @user })
        end
        format.html { render :show, status: :unprocessable_entity }
      end
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
