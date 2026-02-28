import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        });
        const page = await browser.newPage();

        console.log('Navigating to Home Page...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        console.log('Taking Home Page screenshot...');
        await page.screenshot({ path: 'home_page_node.png', fullPage: true });

        // Click Sign In
        console.log('Clicking Sign In...');
        // Finding the link with text "Sign In"
        // Since HashRouter might be used or just standard link
        const links = await page.$$('a');
        let clicked = false;
        for (const link of links) {
            const text = await page.evaluate(el => el.textContent, link);
            if (text && text.includes('Sign In')) {
                await link.click();
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            console.log('Could not find "Sign In" link by text, trying href...');
            const signInLink = await page.$('a[href="/login"]');
            if (signInLink) await signInLink.click();
        }

        // Wait for navigation or login form
        // The login page has an input type="email"
        await page.waitForFunction(() => document.querySelector('input[type="email"]'), { timeout: 10000 }).catch(() => console.log('Timeout waiting for login input'));

        console.log('Taking Login Page screenshot...');
        await page.screenshot({ path: 'login_page_node.png', fullPage: true });

        await browser.close();
        console.log('Verification Complete!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
