from pages.basepage import BasePage

class SearchPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        # IDs confirmed from image_50527f.jpg
        self.from_input = "input[data-testid='station-selector-input-from']"
        self.to_input = "input[data-testid='station-selector-input-to']"

    def select_stations_and_swap(self, origin, destination):
        self.page.get_by_label("From").fill(origin)
        self.page.get_by_role("option", name=origin).first.click()
        
        self.page.get_by_label("To").fill(destination)
        self.page.get_by_role("option", name=destination).first.click()
        
        # Use the swap button logic
        self.page.get_by_label("Swap stations").click()

    def add_return_trip(self):
        self.page.get_by_role("button", name="Add a return trip").click()