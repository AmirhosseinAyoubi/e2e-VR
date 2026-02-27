from pages.navigationpage import NavigationPage
from playwright.sync_api import expect

def test_header_navigation_and_search_modal(page):
    nav = NavigationPage(page)
    nav.navigate("/")
    
    # Test Language Switch (as required in your navigation.spec.ts)
    nav.page.get_by_role("link", name="SV").click()
    expect(page).to_have_url(lambda url: "/sv/" in url)
    
    # Test Site Search Modal
    nav.open_site_search()
    expect(page.get_by_placeholder("Sök på vr.fi")).to_be_visible()