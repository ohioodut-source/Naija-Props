import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        # Launch browser (try Chromium first)
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to http://localhost:5173...")
        try:
            await page.goto("http://localhost:5173")
            await page.wait_for_load_state("networkidle")
            
            # Take screenshot of Home Page
            print("Taking screenshot of Home Page...")
            await page.screenshot(path="home_page.png", full_page=True)

            # Click Sign In
            print("Clicking Sign In...")
            await page.click("text=Sign In")
            await page.wait_for_url("**/login")
            
            # Take screenshot of Login Page
            print("Taking screenshot of Login Page...")
            await page.screenshot(path="login_page.png", full_page=True)
            
            print("Verification Complete! Screenshots saved: home_page.png, login_page.png")
            
        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
