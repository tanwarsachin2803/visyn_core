import { Page, Locator } from '@playwright/test';

class DashboardPage{

    private page: Page;
    // to get all the sections
    readonly allSections:Locator;
    //article[@id='thead-lu-84nT0']/section

    constructor(page: Page) {
        this.page = page;
    }

}