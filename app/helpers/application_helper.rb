module ApplicationHelper
  def amenity_icon(amenity)
    case amenity.to_s.downcase.strip
    when /wifi|internet/
      "fa-wifi"
    when /ac|air conditioning/
      "fa-snowflake"
    when /tv|television/
      "fa-tv"
    when /kitchen|stove|microwave/
      "fa-kitchen-set"
    when /fridge|refrigerator/
      "fa-temperature-low"
    when /check-in/
      "fa-key"
    when /dryer|washing/
      "fa-shirt"
    when /shower|bath|toilet|bidet/
      "fa-hot-tub-person"
    when /coffee/
      "fa-mug-hot"
    when /iron/
      "fa-bolt"
    when /wardrobe|clothing|hanger/
      "fa-shirt" # using fa-shirt as a fallback since fa-hanger might not be in the free set or version
    else
      "fa-check"
    end
  end
end
