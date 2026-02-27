from pages.basepage import BasePage

class NavigationPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        # ARIA label 'Search' found in the DevTools screenshot
        self.search_trigger = "button[aria-label='Search']" 

    def open_site_search(self):
        self.page.get_by_label("Search").click()
        # Verify the modal input appears
        self.page.get_by_placeholder("Search vr.fi").wait_for(state="visible")