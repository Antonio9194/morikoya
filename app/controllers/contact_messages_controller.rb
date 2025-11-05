class ContactMessagesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[new create]

  def new
    @contact_message = ContactMessage.new
  end

  def create
    @contact_message = ContactMessage.new(contact_message_params)

    @contact_message.user_id = current_user.id if current_user.present?

    if @contact_message.save
      ContactMailer.new_message(@contact_message).deliver_now
      if current_user.present?
        redirect_to guest_path(current_user), notice: "Message sent successfully!"
      else
        redirect_to new_contact_message_path, notice: "Message sent successfully!"
      end
    else
      flash.now[:alert] = "Failed to send message, please try again"
      render :new, status: :unprocessable_entity
    end
  end

  private

  def contact_message_params
    params.require(:contact_message).permit(:name, :email, :message)
  end
end
