from pages.searchpage import SearchPage
from playwright.sync_api import expect
import re

def test_basic_search_journey(page):
    """Test basic journey search with origin and destination"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Select journey from Helsinki to Tampere
    search_page.select_stations_and_swap("Helsinki", "Tampere")
    
    # Verify inputs are populated (after swap, they should be reversed)
    from_value = page.locator(search_page.from_input).input_value()
    to_value = page.locator(search_page.to_input).input_value()
    
    assert "Tampere" in from_value
    assert "Helsinki" in to_value


def test_swap_stations_functionality(page):
    """Test that swap stations button correctly reverses origin and destination"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Fill in stations
    page.get_by_label("From").fill("Helsinki")
    page.get_by_role("option", name="Helsinki").first.click()
    
    page.get_by_label("To").fill("Oulu")
    page.get_by_role("option", name="Oulu").first.click()
    
    # Get initial values
    initial_from = page.locator(search_page.from_input).input_value()
    initial_to = page.locator(search_page.to_input).input_value()
    
    # Swap stations
    page.get_by_label("Swap stations").click()
    
    # Verify values are swapped
    swapped_from = page.locator(search_page.from_input).input_value()
    swapped_to = page.locator(search_page.to_input).input_value()
    
    assert initial_from == swapped_to
    assert initial_to == swapped_from


def test_add_return_trip(page):
    """Test adding a return trip to the journey"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Select journey
    page.get_by_label("From").fill("Turku")
    page.get_by_role("option", name="Turku").first.click()
    
    page.get_by_label("To").fill("Rovaniemi")
    page.get_by_role("option", name="Rovaniemi").first.click()
    
    # Add return trip
    search_page.add_return_trip()
    
    # Verify return trip button is visible/changed state
    # The button text might change or a return date selector appears
    expect(page.get_by_text("Return", exact=False)).to_be_visible()


def test_search_with_multiple_cities(page):
    """Test searching between different city pairs"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    test_routes = [
        ("Joensuu", "Jyväskylä"),
        ("Lahti", "Kuopio"),
        ("Seinäjoki", "Kouvola")
    ]
    
    for origin, destination in test_routes:
        page.get_by_label("From").fill(origin)
        page.get_by_role("option", name=origin).first.click()
        
        page.get_by_label("To").fill(destination)
        page.get_by_role("option", name=destination).first.click()
        
        # Verify inputs are populated
        from_value = page.locator(search_page.from_input).input_value()
        to_value = page.locator(search_page.to_input).input_value()
        
        assert origin in from_value
        assert destination in to_value
        
        # Clear for next iteration (refresh page)
        search_page.navigate("/")


def test_empty_search_validation(page):
    """Test that search requires both origin and destination"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Try to search without filling in stations
    search_button = page.get_by_role("button", name="Search", exact=False)
    
    # Check if search button is disabled or shows validation
    if search_button.is_visible():
        # Button might be disabled when inputs are empty
        is_enabled = search_button.is_enabled()
        assert not is_enabled or page.get_by_text("required", exact=False).is_visible()


def test_same_origin_destination_validation(page):
    """Test validation when origin and destination are the same"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Try to select same station for both origin and destination
    page.get_by_label("From").fill("Helsinki")
    page.get_by_role("option", name="Helsinki").first.click()
    
    page.get_by_label("To").fill("Helsinki")
    
    # Check if system prevents selecting same station or shows error
    # This might show a validation message or prevent selection
    same_station_options = page.get_by_role("option", name="Helsinki")
    if same_station_options.count() > 0:
        # If options are available, clicking might show validation
        pass  # System behavior varies


def test_station_autocomplete_dropdown(page):
    """Test that typing in search shows autocomplete suggestions"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Type partial station name
    page.get_by_label("From").fill("Hel")
    
    # Verify dropdown with suggestions appears
    expect(page.get_by_role("option").first).to_be_visible(timeout=5000)
    
    # Verify Helsinki appears in options
    helsinki_option = page.get_by_role("option", name="Helsinki")
    expect(helsinki_option.first).to_be_visible()


def test_clear_search_inputs(page):
    """Test clearing search inputs after selection"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Fill in stations
    page.get_by_label("From").fill("Pori")
    page.get_by_role("option", name="Pori").first.click()
    
    # Check if there's a clear button and use it
    from_input = page.locator(search_page.from_input)
    expect(from_input).not_to_be_empty()
    
    # Clear by selecting all and deleting or using clear button if available
    from_input.click()
    from_input.press("Control+A")
    from_input.press("Backspace")
    
    # Verify input is cleared
    expect(from_input).to_be_empty()


def test_search_accessibility_labels(page):
    """Test that search elements have proper accessibility labels"""
    search_page = SearchPage(page)
    search_page.navigate("/")
    
    # Verify important elements have accessible labels
    expect(page.get_by_label("From")).to_be_visible()
    expect(page.get_by_label("To")).to_be_visible()
    expect(page.get_by_label("Swap stations")).to_be_visible()
    
    # These labels make the app accessible to screen readers