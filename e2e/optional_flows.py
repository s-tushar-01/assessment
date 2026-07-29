import os
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright


API = "http://localhost:3000"
FRONTEND = "http://localhost:5173"


def main() -> None:
    artifacts = Path("artifacts")
    artifacts.mkdir(exist_ok=True)
    run_id = datetime.now().strftime('%Y%m%d%H%M%S')
    email = f"e2e-{run_id}@example.com"
    vehicle_model = f"Test Car {run_id}"

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto(FRONTEND)
        page.wait_for_load_state("networkidle")

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

        token = page.evaluate("localStorage.getItem('dealership_token')")
        response = page.request.post(
            f"{API}/api/vehicles",
            headers={"Authorization": f"Bearer {token}"},
            data={
                "make": "Playwright",
                "model": vehicle_model,
                "category": "E2E",
                "price": 19999,
                "quantity": 2,
            },
        )
        assert response.ok, response.text()
        page.reload()
        page.wait_for_load_state("networkidle")
        page.get_by_text(f"Playwright {vehicle_model}").last.wait_for()

        page.get_by_label("Make").fill("Playwright")
        page.get_by_label("Minimum price").fill("10000")
        page.get_by_role("button", name="Search").click()
        page.get_by_text(f"Playwright {vehicle_model}").last.wait_for()

        vehicle_card = page.get_by_role("article").filter(has_text=f"Playwright {vehicle_model}").last
        vehicle_card.get_by_role("button", name="Purchase").click()
        vehicle_card.get_by_text("1 in stock").wait_for()
        page.screenshot(path=str(artifacts / "optional-purchase-flow.png"), full_page=True)

        admin_email = os.getenv("E2E_ADMIN_EMAIL")
        if admin_email and os.getenv("E2E_ADMIN_PASSWORD"):
            print("Admin browser flow credentials supplied; run the admin controls flow separately.")
        else:
            print("Optional admin browser flow skipped: E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD not supplied.")

        browser.close()


if __name__ == "__main__":
    main()
