// pages/landingPage.ts
import { Page, Locator } from '@playwright/test';
import commonactions from '../utils/commonactions';

class LandingPage extends commonactions {

    private page: Page;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(); // Call the parent constructor
        this.page = page;

        // Locators
        this.usernameTextbox = page.locator('input[placeholder="Username"]');
        this.passwordTextbox = page.locator('input[placeholder="Password"]');
        this.loginButton = page.locator('button[type="submit"]');
    }

    // Page-specific methods
    async login(username: string, password: string): Promise<void> {
        await this.fillElement(this.usernameTextbox, username);
        await this.fillElement(this.passwordTextbox, password);
        await this.clickElement(this.loginButton);
    }
}

export default LandingPage;
