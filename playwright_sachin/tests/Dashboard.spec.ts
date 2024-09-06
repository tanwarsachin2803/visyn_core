import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import LandingPage from '../e2e-automation/pages/landingPage';
import Barchart from '../e2e-automation/pages/dashboard/components/Barchart';
import CommonActions from '../e2e-automation/utils/commonactions';
import BarchartTests from '../testfiles/barchartTest';
import MoreFunctionality from '../e2e-automation/utils/more_functionality';
import BarchartPage from '../e2e-automation/pages/dashboard/components/Barchart';
import { Console } from 'console';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let barchartTests: BarchartTests;
let barchart: BarchartPage;
let actions: CommonActions;
let listRowValues: number[];

test.beforeEach(async ({ browser: b }) => {
    browser = b;
    context = await browser.newContext();
    page = await context.newPage();
    barchartTests = new BarchartTests(page);
    barchart = new BarchartPage(page);
    actions = new CommonActions();
    await barchartTests.setup();
    listRowValues = [];
});

test('Verifying the sorting in Descending order for particular functionality ', async () => {
    await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    const sectionDataType = barchartTests.getSectionDataType(4);
    if ((await sectionDataType).match('number')) {
        await barchartTests.clickingSortingFunctionality(4);
    }
    else {
        await barchartTests.clickingSortingFunctionality(4);
        await barchartTests.clickingSortingFunctionality(4);
    }
    await sleep(3000);
    let rowValue;
    for (let j = 4; j < 14; j++) {
        rowValue = await barchartTests.gettingRowTextValues(4, j);
        listRowValues.push(rowValue);
    }
    await barchartTests.verifyingTheSortFunctionality(listRowValues, "Descending");
});

test('Verifying the sorting in Ascending order for particular functionality ', async () => {
    await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    const sectionDataType = barchartTests.getSectionDataType(4);
    if ((await sectionDataType).match('categorical') || (await sectionDataType).match('boolean')) {
        await barchartTests.clickingSortingFunctionality(4);
    }
    else {
        await barchartTests.clickingSortingFunctionality(4);
        await barchartTests.clickingSortingFunctionality(4);
    }
    await sleep(3000);
    let rowValue;
    for (let j = 4; j < 14; j++) {
        rowValue = await barchartTests.gettingRowTextValues(5, j);
        listRowValues.push(rowValue);
    }
    await barchartTests.verifyingTheSortFunctionality(listRowValues, "Ascending");
});

// check the sorting functionality of all the attributes available as of now
test('Verifying sorting for all given functionalities are working or not', async () => {
    test.setTimeout(120000); // Timeout in milliseconds (e.g., 120000 ms = 2 minutes)
    let count = await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    for (let i = 4; i < count; i++) {
        if (getValue('Sort', i)?.match('yes')) {
            const sectionDataType = barchartTests.getSectionDataType(i);
            if ((await sectionDataType).match('categorical') || (await sectionDataType).match('boolean')) {
                await barchartTests.clickingFilterFunctionality(i);
                await barchartTests.applyMissingValueFilter();
                await sleep(2000);
                await barchartTests.clickingSortingFunctionality(i);
            }
            else {
                await barchartTests.clickingSortingFunctionality(i);
                await barchartTests.clickingSortingFunctionality(i);
            }
            await sleep(3000);
            let rowValue;
            for (let j = 4; j < 14; j++) {
                rowValue = await barchartTests.gettingRowTextValues(i, j);
                listRowValues.push(rowValue);
            }
        }
        await barchartTests.verifyingTheSortFunctionality(listRowValues, "Ascending");
    }
});

// check the sorting functionality of all the attributes available as of now
test('Verifying the group functionality', async () => {
    let count = await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    for (let i = 4; i < 10; i++) {
        if (getValue('Group', i)?.match('yes')) {
            await barchartTests.clickingGroupFunctionality(i);
            await sleep(3000);
            let rowValue;
            for (let j = 4; j < 14; j++) {
                rowValue = await barchartTests.gettingRowTextValues(i, j);
                listRowValues.push(rowValue);
            }
        }

    }
    await barchartTests.verifyingTheGroupFunctionality(listRowValues);
});

// check the sorting functionality of all the attributes available as of now
test('verifying the more functionality with sort by values', async () => {
    let count = await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    for (let i = 4; i < 10; i++) {
        if (getValue('More', i)?.match('yes')) {
            await barchartTests.clickOnFunction(i, 'More');
            console.log("await barchartTests.clickOnFunction(i,'More');");
            await sleep(3000);
            let rowValue;
            for (let j = 4; j < 14; j++) {
                rowValue = await barchartTests.gettingRowTextValues(i, j);
                listRowValues.push(rowValue);
            }
        }
        await barchartTests.verifyingTheSortFunctionality(listRowValues, "Descending");
    }
});

test('verifying the filter functionality with unselect all', async () => {
    let count = await barchartTests.verifySectionCount();
    await barchartTests.storeValuesForSorting();
    for (let i = 4; i < 10; i++) {
        const sectionDataType = barchartTests.getSectionDataType(i);
        if ((await sectionDataType).match('categorical')) {
            await barchartTests.clickingFilterFunctionality(i);
            await barchartTests.applyUnSelectAllFilter();
            await sleep(3000);
            let rowValue;
            for (let j = 4; j < 14; j++) {
                rowValue = await barchartTests.gettingRowTextValues(i, j);
                listRowValues.push(rowValue);
            }
        }
    }
    await barchartTests.verifyingTheGroupFunctionality(listRowValues);
});



test('Verifying the select all functionality', async () => {
    await actions.clickElement(barchart.selectAll_Button);
    await actions.checkElement(barchart.selectAll_Button);
    await actions.uncheckElement(barchart.selectAll_Button);
})


async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to get the 'Sort' value
function getValue(functionaltyName: string, sectionId: number): string | undefined {
    const sectionMap = barchartTests.allFields.get(sectionId);
    if (sectionMap) {
        return sectionMap.get(functionaltyName);
    }
    return undefined;
}

// Method to get the count of entries for a specific section ID
function getCountBySectionId(sectionId: number): number | undefined {
    const innerMap = barchartTests.allFields.get(sectionId);
    if (innerMap) {
        return innerMap.size;
    } else {
        console.error(`Section ID ${sectionId} not found`);
        return undefined;
    }
}




