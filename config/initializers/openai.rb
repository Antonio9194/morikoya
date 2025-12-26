require 'openai'

OpenAI.configure do |config|
  config.access_token = ENV.fetch('CHATBOX_KEY')
end
