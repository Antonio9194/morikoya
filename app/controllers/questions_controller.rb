class QuestionsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[create]
  before_action :ensure_session_id

  def create
    @question = Question.new(question_params)
    @question.session_id = ensure_session_id
    @question.user_id = current_user&.id

    if @question.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.append(:questions, partial: 'questions/question',
                                                               locals: { question: @question })
        end
        format.html { redirect_to root }
      end
    else
      flash.now[:alert] = 'Failed to ask question, please try again'
      @contact_message = ContactMessage.new
      render 'contact_messages/new', status: :unprocessable_entity
    end
  end

  private

  def question_params
    params.require(:question).permit(:user_question)
  end

  def ensure_session_id
    session[:anonymous_id] ||= SecureRandom.uuid
  end
end
