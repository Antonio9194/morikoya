class RemoveWideDoubleFromRooms < ActiveRecord::Migration[7.1]
  def change
    remove_column :rooms, :wide_double, :string
  end
end
