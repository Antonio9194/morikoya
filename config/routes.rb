Rails.application.routes.draw do
  devise_for :users

  # Rooms & bookings (guest side)
  resources :rooms, only: [:index, :show] do
    resources :bookings, only: [:new, :create]
  end

  # Bookings with confirmation page
  resources :bookings, only: [:show] do
    member do
      get 'confirmation'
      patch 'cancel'
    end
  end

  # Payments
  resources :payments, only: [:new, :create]

  # Guest dashboard
  resource :profile, only: [:update], controller: 'guests'
  get 'dashboard', to: 'guests#show', as: :guest_dashboard

  # 'Guests' booking (keeping for backward compatibility)
  resources :guests, only: [:show, :update] do
    resources :bookings, only: [:index, :show]
  end


  # Admin only
  namespace :admin do
    resources :rooms
    resources :bookings, only: [:index, :show]
    resources :contact_messages, only: [:index, :show, :destroy]
  end

  # Contact messages (guest side)
  resources :contact_messages, only: [:new, :create]

  get "about_us", to: "pages#about_us"
  get "faqs", to: "pages#faqs"

  root "pages#home"
end
