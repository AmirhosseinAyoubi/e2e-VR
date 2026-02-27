from pages.basepage import BasePage

class HomePage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.hero_banner = "section[data-testid='hero-banner']"
        self.tickets_tab = "button:has-text('Tickets')"

    def is_loaded(self):
        return self.page.locator(self.hero_banner).is_visible()