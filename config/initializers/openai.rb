if ENV['CHATBOX_KEY'].present?
  OpenAI.configure do |config|
    config.access_token = ENV['CHATBOX_KEY']
  end
end
