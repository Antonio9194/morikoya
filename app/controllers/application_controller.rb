class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
<<<<<<< HEAD
  before_action :set_locale
=======
  before_action :render_questions
  before_action :ensure_session_id
>>>>>>> 5fd42bedec254a750904ed36828f6428de015d5b

  def configure_permitted_parameters
    # For additional fields in app/views/devise/registrations/new.html.erb
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[first_name last_name phone_number email])

    # For additional in app/views/devise/registrations/edit.html.erb
    devise_parameter_sanitizer.permit(:account_update, keys: %i[first_name last_name phone_number email])
  end

<<<<<<< HEAD
  private

  # Reads the user's language for the session, if not detected goes to english
  def set_locale
    I18n.locale = session[:locale] || I18n.default_locale
=======
  def render_questions
    @questions = if current_user
                   Question.where(user_id: current_user.id).order(:created_at)
                 else
                   Question.where(session_id: ensure_session_id, user_id: nil).order(:created_at)
                 end
  end

  private

  def ensure_session_id
    session[:anonymous_id] ||= SecureRandom.uuid
>>>>>>> 5fd42bedec254a750904ed36828f6428de015d5b
  end
end
