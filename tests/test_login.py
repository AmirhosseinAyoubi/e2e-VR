from pages.loginpage import LoginPage
from playwright.sync_api import expect

def test_login_page_smoke_and_validation(page):
    login_page = LoginPage(page)
    
    # 1. Start at Home (BasePage handles cookies and language automatically)
    login_page.navigate("/")
    
    # 2. Transition to the login page via UI click
    login_page.navigate_to_login_via_home()
    
    # 3. Smoke Test: Verify fields are present on the login screen
    expect(page.locator(login_page.email_input)).to_be_visible()
    expect(page.locator(login_page.password_input)).to_be_visible()
    
    # 4. Validation: Test empty submission
    login_page.login("", "")
    
    # Expect validation error text to appear (common in VR's stack)
    expect(page.get_by_text("Please enter your email")).to_be_visible()