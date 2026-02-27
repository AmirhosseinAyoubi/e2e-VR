from pages.basepage import BasePage

class SearchPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        # Verified data-testids from image_50527f.jpg
        self.from_input = "input[data-testid='station-selector-input-from']"
        self.to_input = "input[data-testid='station-selector-input-to']"
        self.search_btn = "button[data-testid='search-button']"

    def select_journey(self, origin, destination):
        # Fill inputs and select from the dropdown options
        self.page.get_by_label("From").fill(origin)
        self.page.get_by_role("option", name=origin).first.click()
        
        self.page.get_by_label("To").fill(destination)
        self.page.get_by_role("option", name=destination).first.click()

    def swap_stations(self):
        """Simulates the station swap functionality."""
        self.page.get_by_label("Swap stations").click()