from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def navigate(self, path: str = "/en"):
        # Force the English path directly
        self.page.goto(f"https://www.vr.fi{path}")
        # Clear the modal immediately
        self.handle_cookie_consent()
        
        # If the page still says 'Kirjaudu' (Finnish for Login), click the EN toggle
        if self.page.get_by_text("Kirjaudu").is_visible():
            self.page.get_by_role("link", name="EN").first.click()
            self.page.wait_for_url("**/en**")

    def handle_cookie_consent(self):
        """Clears the modal using both possible language strings."""
        # Found in image_5060c8.jpg: 'Hyväksyn kaikki evästeet'
        accept_btn = self.page.locator("button:has-text('Accept all'), button:has-text('Hyväksyn kaikki evästeet')")
        try:
            accept_btn = self.page.locator("button:has-text('Accept all'), button:has-text('Hyväksyn kaikki')")
            accept_btn.wait_for(state="visible", timeout=5000) 
            accept_btn.click()
        except:
            pass

    def click(self, selector: str):
        self.page.locator(selector).click()

    def fill(self, selector: str, text: str):
        self.page.locator(selector).fill(text)