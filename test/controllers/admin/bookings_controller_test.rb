require "test_helper"

class Admin::BookingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_bookings_index_url
    assert_response :success
  end

  test "should get show" do
    get admin_bookings_show_url
    assert_response :success
  end

  test "should get destroy" do
    get admin_bookings_destroy_url
    assert_response :success
  end
end
