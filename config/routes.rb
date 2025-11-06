Rails.application.routes.draw do
  devise_for :users

  # Rooms & bookings (guest side)
  resources :rooms, only: %i[index show] do
    resources :bookings, only: %i[new create]
  end

  # Bookings with confirmation page
  resources :bookings, only: [:show] do
    member do
      get 'confirmation'
      patch 'cancel'
    end
  end

  # Payments
  resources :payments, only: %i[new create]

  # 'Guests' booking
  resources :guests, only: [:show] do
    resources :bookings, only: %i[index show]
  end

  # Admin only
  namespace :admin do
    resources :rooms
    resources :bookings, only: %i[index show]
    resources :contact_messages, only: %i[index show destroy]
  end

  # Contact messages (guest side)
  resources :contact_messages, only: %i[new create]

  get 'about_us', to: 'pages#about_us'
  get 'faqs', to: 'pages#faqs'

  root 'pages#home'
end
