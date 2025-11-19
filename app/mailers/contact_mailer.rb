class ContactMailer < ApplicationMailer
  default to: "antoniov@morikoyahotel.com"

  def new_message(contact_message)
    @contact_message = contact_message
    mail(
      from: ENV.fetch('GMAIL_USER', nil),
      reply_to: @contact_message.email,
      subject: "New Message from #{@contact_message.name}",
      body: <<~BODY
        Name: #{@contact_message.name}
        Email: #{@contact_message.email}
        Message:
        #{@contact_message.message}
      BODY
    )
  end
end
