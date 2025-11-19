class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :start_date, :end_date, presence: true
  # TO-DO: Add validation for payment later (if needed)

  # for money-rails to know that total_price_cents is a money field
  monetize :total_price_cents, with_currency: :jpy

  validates :payment_status, inclusion: { in: %w[pending paid failed refunded] }

  # Calculate total price before validation (so it's ready for payment)
  before_validation :calculate_total_price, on: :create

  # Scopes for filtering bookings
  scope :upcoming, -> { where("start_date >= ?", Date.today) }
  scope :confirmed, -> { where(status: 'confirmed') }
  scope :ongoing, -> { where("start_date <= ? AND end_date >= ?", Date.today, Date.today) }
  scope :past, -> { where("end_date < ?", Date.today) }
  scope :future, -> { where("start_date > ?", Date.today) }

  def start_date_cannot_be_in_the_past
    if start_date.present? && start_date < Date.today
      errors.add(:start_date, "can't be in the past")
    end
  end

  def end_date_cannot_be_in_the_past
    if end_date.present? && end_date < Date.today
      errors.add(:end_date, "can't be in the past")
    end
  end

  def plan_date_cannot_be_reverse
    if start_date.present? && end_date.present? && end_date < start_date
      errors.add(:end_date, "can't be before starting date")
    end
  end

  def number_of_nights
    return 0 if start_date.nil? || end_date.nil?

    (end_date - start_date).to_i
  end

  def stripe_receipt_url
    return nil unless stripe_payment_intent_id && payment_status == 'paid'

    begin
      payment_intent = Stripe::PaymentIntent.retrieve(stripe_payment_intent_id)
      charge_id = payment_intent.latest_charge
      return nil unless charge_id

      charge = Stripe::Charge.retrieve(charge_id)
      charge.receipt_url
    rescue Stripe::StripeError => e
      Rails.logger.error "Failed to retrieve Stripe receipt: #{e.message}"
      nil
    end
  end

  private

  def calculate_total_price
    if room && start_date && end_date
      nights = number_of_nights
      self.total_price_cents = room.price_per_night * nights
    end
  end
end
