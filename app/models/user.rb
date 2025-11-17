class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { guest: "guest", admin: "admin" }, _default: "guest"

  has_many :bookings, dependent: :destroy
  has_many :contact_messages, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone_number, format: { with: /\A[+]?[\d\s\-()]+\z/, message: "invalid format" }, allow_blank: true, presence: true
end
