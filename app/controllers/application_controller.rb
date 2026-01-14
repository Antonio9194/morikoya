class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale
  before_action :ensure_session_id
  before_action :render_questions

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[first_name last_name phone_number email]
    )

    devise_parameter_sanitizer.permit(
      :account_update,
      keys: %i[first_name last_name phone_number email]
    )
  end

  private

  # Reads the user's language for the session, defaults to English
  def set_locale
    I18n.locale = session[:locale] || I18n.default_locale
  end

  def render_questions
    @questions =
      if current_user
        Question.where(user_id: current_user.id).order(:created_at)
      else
        Question.where(session_id: session[:anonymous_id], user_id: nil)
                .order(:created_at)
      end
  end

  def ensure_session_id
    session[:anonymous_id] ||= SecureRandom.uuid
  end
end
