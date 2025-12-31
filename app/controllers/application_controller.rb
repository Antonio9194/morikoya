class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :render_questions
  before_action :ensure_session_id

  def configure_permitted_parameters
    # For additional fields in app/views/devise/registrations/new.html.erb
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[first_name last_name phone_number email])

    # For additional in app/views/devise/registrations/edit.html.erb
    devise_parameter_sanitizer.permit(:account_update, keys: %i[first_name last_name phone_number email])
  end

  def render_questions
    @questions = if current_user
                   Question.where(user_id: current_user.id)
                 else
                   Question.where(session_id: ensure_session_id, user_id: nil)
                 end
  end

  private

  def ensure_session_id
    session[:anonymous_id] ||= SecureRandom.uuid
  end
end
