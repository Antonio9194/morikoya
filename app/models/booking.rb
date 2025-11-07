class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room
  has_many :bookings

  validates :start_date, :end_date, presence: true
  # TO-DO: Add validation for payment later (if needed)

  # for money-rails to know that total_price_cents is a money field
  monetize :total_price_cents, with_currency: :jpy

  validates :payment_status, inclusion: { in: %w[pending paid failed refunded] }

  # Calculate total price before validation (so it's ready for payment)
  before_validation :calculate_total_price, on: :create

  scope :upcoming, -> { where('start_date >= ?', Date.today) }

  def start_date_cannot_be_in_the_past
    return unless start_date.present? && start_date < Date.today

    errors.add(:start_date, "can't be in the past")
  end

  def end_date_cannot_be_in_the_past
    return unless end_date.present? && end_date < Date.today

    errors.add(:end_date, "can't be in the past")
  end

  def plan_date_cannot_be_reverse
    return unless start_date.present? && end_date.present? && end_date < start_date

    errors.add(:end_date, "can't be before starting date")
  end

  def number_of_nights
    return 0 if start_date.nil? || end_date.nil?

    (end_date - start_date).to_i
  end

  private

  def calculate_total_price
    return unless room && start_date && end_date

    nights = number_of_nights
    self.total_price_cents = room.price_per_night * nights
  end
end
