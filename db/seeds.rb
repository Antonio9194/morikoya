require 'faker'

puts 'Starting reboot...'

# Wipe everything first
Booking.destroy_all
ContactMessage.destroy_all
Room.destroy_all
User.destroy_all

puts 'Destroying database...'

User.create!(
  email: 'antoniov@morikoyahotel.com',
  phone_number: '123-1234-12345',
  password: 'marvelous',
  role: 'admin',
  first_name: 'Antonio',
  last_name: 'Vinciguerra'
)

User.create!(
  email: 'anto.vinciguerra@hotmail.com',
  phone_number: '123-1234-12345',
  password: 'password',
  role: 'guest',
  first_name: 'Antonio',
  last_name: 'Vinciguerra'
)

puts 'Created Antonio’s account'

# Create 20 guest users
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

# Create 6 type A rooms
6.times do |i|
  Room.create!(
    name: "Room A-#{i + 1}",
    room_type: 'A',
    description: 'A bunk bed, a double bed and a sofa bed, all inside one room.',
    price_per_night: 80,
    size: 20,
    bunk: 1,
    double: 1,
    sofa_bed: 1,
    capacity: 5,
    amenities: 'WiFi, Air conditioning, TV, Bathroom'
  )
end

# Create 7 type B rooms
7.times do |i|
  Room.create!(
    name: "Room B-#{i + 1}",
    room_type: 'B',
    description: 'A cozy room with all the basics you need.',
    price_per_night: 80,
    size: 20,
    bunk: 1,
    semi_double: 1,
    sofa_bed: 1,
    capacity: 6,
    amenities: 'WiFi, Air conditioning, TV, Bathroom'
  )
end

# Create 1 type C rooms
Room.create!(
  name: 'Presidential Suite',
  room_type: 'C',
  description: 'Luxury suite with panoramic view, jacuzzi, and extra comfort.',
  price_per_night: 250,
  size: 50,
  single: 2,
  double: 2,
  sofa_bed: 1,
  capacity: 8,
  amenities: 'WiFi, Air conditioning, TV, Jacuzzi, Balcony, Minibar'
)

puts "Created #{Room.count} rooms"

# Create 40 contact messages
40.times do
  ContactMessage.create!(
    name: Faker::Name.name,
    email: Faker::Internet.email,
    message: Faker::Lorem.paragraph(sentence_count: 3),
    user: guests.sample
  )
end

puts "Created #{ContactMessage.count} contact messages"

# Create 30 bookings
30.times do
  room = Room.all.sample

  loop do
    start_date = Faker::Date.forward(days: rand(5..30))
    end_date   = start_date + rand(2..7).days

    # check if this room already has a booking that overlaps
    overlap = Booking.exists?(
      room: room,
      start_date: ..end_date,
      end_date: start_date..
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
