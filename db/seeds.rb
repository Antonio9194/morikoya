require 'faker'

puts 'Starting reboot...'

# Wipe everything first
Booking.destroy_all
ContactMessage.destroy_all
Room.destroy_all
User.destroy_all

puts 'Destroyed database...'

# --- Create Admin and Guest Antonio ---
admin_antonio = User.create!(
  email: 'antoniov@morikoyahotel.com',
  phone_number: '123-1234-12345',
  password: 'marvelous',
  role: 'admin',
  first_name: 'Antonio',
  last_name: 'Vinciguerra'
)

guest_antonio = User.create!(
  email: 'anto.vinciguerra@hotmail.com',
  phone_number: '123-1234-12345',
  password: 'password',
  role: 'guest',
  first_name: 'Antonio',
  last_name: 'Vinciguerra'
)

puts 'Created Antonio’s accounts'

# --- Create 20 guest users ---
guests = 20.times.map do
  User.create!(
    email: Faker::Internet.unique.email,
    phone_number: '123-1234-12345',
    password: 'password123',
    role: 'guest',
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name
  )
end

puts "Created #{User.count} users"

# --- Create Rooms ---
6.times do |i|
  Room.create!(
    name: (301 + i * 100).to_s,
    room_type: 'A',
    description: 'rooms.description.ab',
    price_per_night: 40_000,
    size: 39,
    bunk: 1,
    double: 1,
    sofa_bed: 1,
    capacity: 5,
    amenities: '24-hour Check-In, Air Conditioning, Balcony, Wardrobe, Dryer, ' \
             'Elevator, Drying Rack, Hair dryer, Heating, Hot Water, ' \
             'In person Check-In, Internet, Iron Board, Iron, Linens, Mosquito Net, ' \
             'Private Entrance, Tv, Towels, Washing Machine'
  )
end

7.times do |i|
  Room.create!(
    name: (202 + i * 100).to_s,
    room_type: 'B',
    description: 'rooms.description.ab',
    price_per_night: 40_000,
    size: 42,
    bunk: 1,
    semi_double: 1,
    sofa_bed: 1,
    capacity: 6,
    amenities: '24-hour Check-In, Air Conditioning, Balcony, Wardrobe, Dryer, ' \
             'Elevator, Drying Rack, Hair dryer, Heating, Hot Water, ' \
             'In person Check-In, Internet, Iron Board, Iron, Linens, Mosquito Net, ' \
             'Private Entrance, Tv, Towels, Washing Machine'
  )
end

Room.create!(
  name: '901',
  room_type: 'C',
  description: 'rooms.description.c',
  price_per_night: 50_000,
  size: 65,
  single: 2,
  double: 2,
  sofa_bed: 1,
  capacity: 8,
  amenities: '24-hour Check-In, Air Conditioning, Balcony, Wardrobe, Dryer, ' \
             'Elevator, Drying Rack, Hair dryer, Heating, Hot Water, ' \
             'In person Check-In, Internet, Iron Board, Iron, Linens, Mosquito Net, ' \
             'Private Entrance, Tv, Towels, Washing Machine'
)

puts "Created #{Room.count} rooms"

# --- Create Contact Messages ---
40.times do
  ContactMessage.create!(
    name: Faker::Name.name,
    email: Faker::Internet.unique.email,
    message: Faker::Lorem.paragraph(sentence_count: 3),
    user: guests.sample
  )
end

puts "Created #{ContactMessage.count} contact messages"

# --- Create Antonio's Booking ---
# Pick a specific room or random
antonio_room = Room.all.sample

Booking.create!(
  user: guest_antonio,       # This is Antonio upcoming booking
  room: antonio_room,
  start_date: Date.new(2025, 12, 20),
  end_date: Date.new(2025, 12, 25),
  status: 'confirmed',
  payment_status: 'paid'
)

Booking.create!(
  user: guest_antonio,       # This is Antonio current booking
  room: antonio_room,
  start_date: Date.new(2025, 12, 2),
  end_date: Date.new(2025, 12, 5),
  status: 'confirmed',
  payment_status: 'paid'
)

Booking.create!(
  user: guest_antonio,       # This is Antonio past booking
  room: antonio_room,
  start_date: Date.new(2025, 11, 2),
  end_date: Date.new(2025, 11, 5),
  status: 'confirmed',
  payment_status: 'paid'
)

puts "Created Antonio's booking in room #{antonio_room.name}"

# --- Create 30 Random Bookings ---
30.times do
  room = Room.all.sample

  loop do
    start_date = Faker::Date.forward(days: rand(5..30))
    end_date   = start_date + rand(2..7).days

    overlap = Booking.exists?(
      ['room_id = ? AND start_date < ? AND end_date > ?', room.id, end_date, start_date]
    )

    next if overlap

    Booking.create!(
      user: guests.sample,
      room: room,
      start_date: start_date,
      end_date: end_date,
      status: 'confirmed',
      payment_status: 'paid'
    )
    break
  end
end

puts "Created #{Booking.count} bookings"
puts 'Done seeding!'
