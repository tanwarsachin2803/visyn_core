import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import BarchartTests from '../testfiles/barchartTest';
import Settings from '../e2e-automation/pages/dashboard/components/SettingsPage'
import SettingTest from '../testfiles/settingTest';
import ScatterPlotTest from '../testfiles/scatterplotTest';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let barchartTests: BarchartTests;
let settingspage: Settings;
let settingTest: SettingTest;

test.beforeEach(async ({ browser: b }) => {
    browser = b;
    context = await browser.newContext();
    page = await context.newPage();
    barchartTests = new BarchartTests(page);
    settingspage = new Settings(page);
    settingTest = new SettingTest(page);
    await barchartTests.setup();
    //listRowValues=[];
});

test('Verifying different type of plots', async () => {
    await settingTest.selectingVisualisationType('Correlation plot');  // Added await
});

test('Verifying all the visualisation type of plots', async () => {
    for (let i = 0; i < settingspage.visualizationTypeOptions.length; i++) {
        await settingTest.selectingVisualisationType(i);
    } // Added await
});