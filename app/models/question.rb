class Question < ApplicationRecord
  belongs_to :user, optional: true
  validates :user_question, presence: true
  after_create :fetch_ai_answer

  def fetch_ai_answer
    ChatbotJob.perform_later(self)
  end
end
