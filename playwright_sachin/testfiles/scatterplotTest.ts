import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import ScatterPlot from '../e2e-automation/pages/dashboard/components/ScatterPlot';
import SettingsPage from '../e2e-automation/pages/dashboard/components/SettingsPage';
import CommonActions from '../e2e-automation/utils/commonactions';

class ScatterPlotTest {
    private page: Page;
    private scatterplot: ScatterPlot;
    private settings: SettingsPage;
    private actions: CommonActions;

    constructor(page: Page) {
        this.page = page;
        this.scatterplot = new ScatterPlot(page);
        this.settings = new SettingsPage(page);
        this.actions = new CommonActions();
    }

    async takeSsOfTheGraphs(plotName: string, anotherColumn: string, facetType: string | number) {
        const formattedPlotName = plotName.replace(' ', '-');  // Store the result of the replace operation
        const listValue = this.settings.getFacetListValue(facetType);
        if (anotherColumn.match('facet')) {
            await this.page.waitForTimeout(2000);
            await this.actions.clickElement(this.settings.facetsSelectionTab);
            await this.actions.clickElement(this.settings.getFacetListElement(facetType))
            await this.scatterplot.plot.screenshot({ path: "playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "facet" + "//" + listValue + ".png" });
        }
        if (anotherColumn.match('color')) {
            await this.page.waitForTimeout(2000);
            await this.actions.clickElement(this.settings.colorTab);
            await this.actions.clickElement(this.settings.getFacetListElement(facetType))
            await this.scatterplot.plot.screenshot({ path: "playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "color" + "//" + listValue + ".png" });
        }
        if (anotherColumn.match('shape')) {
            await this.page.waitForTimeout(2000);
            await this.actions.clickElement(this.settings.shapeTab);
            await this.actions.clickElement(this.settings.getFacetListElement(facetType))
            await this.scatterplot.plot.screenshot({ path: "playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "shape" + "//" + listValue + ".png" });
        }
    }

    async verifyTheGraphs(plotName: string) {
        const formattedPlotName = plotName.replace(' ', '-');  // Store the result of the replace operation
        const screenshot = await this.scatterplot.plot.screenshot();
        expect(screenshot).toMatchSnapshot("test-results//" + formattedPlotName + "//default-" + formattedPlotName + ".png", {
            threshold: 0.2, // Adjust threshold based on your tolerance for differences
        });
    }

    async verifyingGraphWithFacets(facetType: string | number) {
        const listValue = this.settings.getFacetListValue(facetType);
        console.log("Facet type ", listValue)
        await this.page.waitForTimeout(2000);
        await this.actions.clickElement(this.settings.facetsSelectionTab);
        await this.actions.clickElement(this.settings.getFacetListElement(facetType));
        const screenshot = await this.scatterplot.plot.screenshot();
        await expect(screenshot).toMatchSnapshot("playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "facet" + "//" + listValue + ".png", { 
            threshold: 0.2, // Adjust threshold based on your tolerance for differences
        });

    }

    async verifyingGraphWithColor(facetType: string | number) {
        const listValue = this.settings.getFacetListValue(facetType);
        console.log("Facet type ", listValue)
        await this.actions.clickElement(this.settings.colorTab);
        await this.page.waitForTimeout(5000);
        //await this.actions.clickElement(this.settings.getFacetListElement(facetType));
        await this.scatterplot.plot.screenshot({ path: "playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "color" + "//" + listValue + ".png" });

    }


    async verifyingGraphWithShape(facetType: string | number) {
        const listValue = this.settings.getFacetListValue(facetType);
        console.log("Facet type ", listValue)
        await this.actions.clickElement(this.settings.shapeTab);
        await this.page.waitForTimeout(10000);

        //await this.actions.clickElement(this.settings.getFacetListElement(facetType));
        await this.scatterplot.plot.screenshot({ path: "playwright_sachin//test-results//" + "Scatter-Plot" + "//" + "shape" + "//" + listValue + ".png" });

    }

}
export default ScatterPlotTest;