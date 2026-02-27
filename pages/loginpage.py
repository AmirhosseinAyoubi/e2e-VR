from pages.basepage import BasePage

class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        # Selectors confirmed from image_5046ba.png
        self.email_input = "input[id='email']"
        self.password_input = "input[id='password']"
        self.login_submit = "button[type='submit']"

    def navigate_to_login_via_home(self):
        """Clicks the 'Log in' or 'Kirjaudu' button in the header."""
        # Use a locator that handles both languages observed in screenshots
        login_btn = self.page.locator("button:has-text('Log in'), button:has-text('Kirjaudu')")
        login_btn.wait_for(state="visible")
        login_btn.click()
        # Verify arrival at the login page shown in image_504b3d.png
        self.page.wait_for_selector(self.email_input)

    def login(self, email, password):
        """Fills the credentials and submits the form."""
        if email:
            self.page.fill(self.email_input, email)
        if password:
            self.page.fill(self.password_input, password)
        self.page.click(self.login_submit)