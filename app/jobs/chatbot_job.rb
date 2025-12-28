require 'openai'

class ChatbotJob < ApplicationJob
  include ActionView::Helpers
  queue_as :default

  def perform(question)
    @question = question
    chatgpt_response = client.chat(
      parameters: {
        model: 'gpt-5.2',
        messages: questions_formatted_for_openai(question)
      }
    )
    response_content = chatgpt_response['choices'][0]['message']['content']
    question.update(ai_answer: response_content)
    # puts new_content
    # puts 'Hey'

    # Turbo::StreamsChannel.broadcast_update_to(
    #   "question_#{@question.id}",
    #   target: "question_#{@question.id}",
    #   partial: "questions/question", locals: { question: question }
    # )
    # Turbo::StreamsChannel.broadcast_append_to(
    #   "question_#{@question.id}",
    #   target: dom_id(@question),
    #   partial: "workout_sessions/ai_exercise_form", locals: { workout_session: @question.workout_session, session_exercise: @session_exercise, scroll: true, exercise: @session_exercise.exercise }
    # )
  end

  private

  def client
    @client ||= OpenAI::Client.new(log_errors: true)
  end

  def questions_formatted_for_openai(question)
    # questions = @question.&user.questions
    results = []

    system_text = "You are an assistant for a website of a hotel named Morikoya, located in Asakusa, Tokyo Japan.
    This website allows users to make bookings, check the hotel's policies or nearby local activities, attractions and transportation.
    Your main users are people who come to Tokyo, Japan for a trip and consider to stay Morikoya.
    1. Always create answers strictly based on the given information in this text. If you don't know the answer, simply say 'The information is not
    available. Please contact our hotel through Contact Us for more details.'"

    system_text += "2. Here are the information you can use to answer users' questions:
    a. Morikoya's address: 〒111-0035 Tokyo, Taito-ku, Nishiasakusa 3-20-13
    b. Transportation: Asakusa offers some of the best transportation access in Tokyo, making it easy to explore the city from our hotel.
    With multiple train lines, airport connections, and sightseeing boats nearby, getting around is simple and convenient.
      - Asakusa Station (Tsukuba Express – TX Line) – 3 min walk: Closest station, easy access to Akihabara & North Tokyo
      - Tawaramachi Station (Ginza Line) – 7 min walk: Fast access to Ueno, Ginza, Shimbashi, Akasaka, Shibuya
      - Asakusa Station (Ginza Line) – 10 min walk: Direct access to Ueno, Ginza, and Shibuya
      - Airport Access
        1. Haneda Airport → Asakusa: Approx. 40–45 min (Toei Asakusa Line, often no transfers)
        2. Narita Airport → Asakusa: Approx. 60–70 min (Keisei Line → Toei Asakusa Line, some through-trains)
      - Bus & Local Transport: Nearby Toei buses connect directly to Ueno, Tokyo Skytree, Tokyo Station, and Nihonbashi. Convenient for guests who prefer above-ground travel
    c. Sightseeing Options
      - Tokyo Water Bus (Sumida River Cruise) – 10 min walk
      - Scenic access to Odaiba, Hamarikyu Gardens, and Hinode Pier
      - Rickshaw tours available throughout Asakusa’s historic streets
    d. Taxi & Ride Share:
      - Taxi stands located near Kaminarimon Gate and Asakusa Station
      - Cashless ride apps available: GO, Uber, DiDi
    e. Check-in and check-out time:
      - Check-in starts from 15:00 & Check-out is until 11:00.
      - Early check-in depends on availability, if possible we will accomodate it for you, while early check-out is always available.
    f. Policies about pets: Pets are not allowed."

    results << { role: 'system', content: system_text }

    # questions.each do |question|
    results << { role: 'user', content: question.user_question }
    results << { role: 'assistant', content: question.ai_answer || '' }
    # end

    results
  end
end
