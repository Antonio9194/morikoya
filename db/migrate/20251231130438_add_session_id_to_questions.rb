class AddSessionIdToQuestions < ActiveRecord::Migration[7.1]
  def change
    add_column :questions, :session_id, :string
  end
end
