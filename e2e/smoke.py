from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    artifacts = Path("artifacts")
    artifacts.mkdir(exist_ok=True)
    email = f"browser-{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")
        page.screenshot(path=str(artifacts / "login.png"), full_page=True)

        page.get_by_role("button", name="Create account").click()
        page.get_by_label("Email").fill(email)
        page.get_by_label("Password", exact=True).fill("password123")
        page.get_by_label("Confirm password").fill("password123")
        page.get_by_role("button", name="Register").click()
        page.get_by_role("heading", name="Sign in").wait_for()

        page.get_by_label("Email").fill(email)
        page.get_by_label("Password", exact=True).fill("password123")
        page.get_by_role("button", name="Sign in").click()
        page.get_by_role("heading", name="Inventory dashboard").wait_for()
        page.screenshot(path=str(artifacts / "inventory-dashboard.png"), full_page=True)

        browser.close()


if __name__ == "__main__":
    main()
