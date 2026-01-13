
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")

            # Wait for content to load
            page.wait_for_selector(".yxj-font")

            # Take screenshot of initial state (Game + Config Button)
            page.screenshot(path="verification/initial_state.png")
            print("Initial state screenshot taken.")

            # Click config button
            page.click("button[title='Configuración']")

            # Wait for Admin Config modal
            page.wait_for_selector("text=Configuración del Juego")

            # Take screenshot of Admin Config
            page.screenshot(path="verification/admin_config.png")
            print("Admin Config screenshot taken.")

            # Modify config (e.g., change totalLives to 3)
            # Find textarea and edit it
            # We get the current value, parse it, modify it, set it back
            # But doing it via text replacement is easier for Playwright

            # Just ensure the textarea is there and has content
            textarea = page.locator("textarea")
            content = textarea.input_value()
            print(f"Config content found: {len(content)} chars")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
