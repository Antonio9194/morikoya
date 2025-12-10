class CancelUnpaidBookingJob < ApplicationJob
  queue_as :default

  def perform(booking_id)
    booking = Booking.find_by(id: booking_id)

    return unless booking
    # (User might have already cancelled it manually, or it might be confirmed)
    return unless booking.status == 'pending'
    return unless booking.payment_status != 'paid'
    Rails.logger.info "Auto-cancelling unpaid booking ##{booking.id}"
    booking.update(status: 'cancelled')
  end
end
