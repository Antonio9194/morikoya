class QuestionsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index create]

  def index
    @questions = Question.all
    @question = Question.new
  end

  def create
    @question = Question.new(question_params)
    @question.user_id = current_user.id if current_user.present?

    if @question.save
      redirect_to questions_path
    else
      flash.now[:alert] = 'Failed to ask question, please try again'
      render :index, status: :unprocessable_entity
    end
  end

  private

  def question_params
    params.require(:question).permit(:user_question)
  end
end
