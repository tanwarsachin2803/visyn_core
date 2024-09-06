import { test, expect, Page } from '@playwright/test';
import SettingsPage from '../e2e-automation/pages/dashboard/components/SettingsPage';
import CommonActions from '../e2e-automation/utils/commonactions';
import ScatterPlotTest from './scatterplotTest';

class SettingTest {
    private page: Page;
    private settings: SettingsPage;
    private actions: CommonActions;
    private scatterplotTest:ScatterPlotTest;


    constructor(page: Page) {
        this.page = page;
        this.settings = new SettingsPage(page); // Initialize the SettingsPage object
        this.actions = new CommonActions();     // Initialize the CommonActions object
        this.scatterplotTest=new ScatterPlotTest(page);
    }

    async selectingVisualisationType(plotName: string) {
        await this.actions.clickElement(this.settings.visualizationType);
        await this.actions.clickElement(this.settings.getVisualisationType_element(plotName));
        await this.scatterplotTest.verifyTheGraphs(plotName);
        const selectedValue = await this.actions.getValueUsingAttribute(this.settings.visualizationType, 'value');
        await expect(selectedValue).toBe(plotName);
    }
}

export default SettingTest;
