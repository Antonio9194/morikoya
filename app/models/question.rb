class Question < ApplicationRecord
  belongs_to :user, optional: true
  validates :user_question, presence: true
end
