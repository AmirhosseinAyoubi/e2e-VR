from pages.homepage import HomePage
from playwright.sync_api import expect
import re

def test_homepage_load_and_visuals(page):
    home = HomePage(page)
    home.navigate("/")
    assert home.is_loaded()
    expect(page).to_have_title(re.compile("VR"))