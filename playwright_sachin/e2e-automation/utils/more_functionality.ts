import { Locator, Page, expect } from '@playwright/test';
import { ElementRetriever } from '../utils/elementRetriever';
import CommonActions from './commonactions';

class MoreFunctionality extends ElementRetriever {
    readonly moreOptions: Locator;
    public moreOptionsList: Map<string, number>;
    public moreOptionFunctionalityList: Map<string, number>;
    private dataOptionsList = new Map<string, number>;
    private actions: CommonActions;
    moreOptionFunctionalities: Locator;

    constructor(page: Page) {
        super(page);
        this.actions = new CommonActions();
        // Initialize the moreOptions Locator
        this.moreOptions = this.getElement('xpath', "//form[@class='lu-dialog lu-more-options']/i");
        this.moreOptionFunctionalities = this.getElement('xpath', "//form[@class='lu-dialog']/label/span");
        // Initialize the Map for more options
        this.moreOptionsList = new Map<string, number>();
        this.moreOptionFunctionalityList = new Map<string, number>();
        this.dataOptionsList = new Map<string, number>();
    }
    async setMoreFunctionalityOptions(locator: Locator): Promise<void> {
        const count = await locator.count(); // Get the count of elements matching the locator
        // Clear existing options if necessary
        this.moreOptionsList.clear();
        for (let i = 0; i < count; i++) { // Start from 0, as locator.index is 0-based
            const optionLocator = locator.nth(i); // Access the nth element
            const textContent = await optionLocator.textContent(); // Get the text content of the element
            this.moreOptionsList.set(textContent ?? '', i + 1); // Store in the map, default to '' if null/undefined
        }
    }

    async setMoreOptionsFunctionalityList(): Promise<void> {
        const count = await this.moreOptionFunctionalities.count(); // Get the count of elements matching the locator
        console.log("count " + count);
        // Clear existing options if necessary
        this.moreOptionsList.clear();
        for (let i = 0; i < count; i++) { // Start from 0, as locator.index is 0-based
            let y = i + 1;
            let xpath = "//form[@class='lu-dialog']/label[" + y + "]/span";
            const optionLocator = this.getElement('xpath', xpath);
            const textContent = await optionLocator.textContent(); // Get the text content of the element
            console.log('value is ' + textContent);
            this.moreOptionFunctionalityList.set(textContent ?? '', i + 1); // Store in the map, default to '' if null/undefined
        }
    }


    getMoreOptionsFunctionality(actionTakenOnList: string): Locator {
        const valueNumber = this.moreOptionsList.get(actionTakenOnList);
        console.log("key is " + actionTakenOnList + " value is " + valueNumber);
        // Use backticks for template literals and `${valueNumber}` to interpolate the valueNumber
        return this.getElement('xpath', `//form[@class='lu-dialog lu-more-options']/i[${valueNumber}]`);
    }

    getTypeOfActionWithinTheFunctionality(actionTakenOnList: string): Locator {
        const valueNumber = this.moreOptionFunctionalityList.get(actionTakenOnList);
        console.log("key is " + actionTakenOnList + " value is " + valueNumber);
        return this.getElement('xpath', `//form[@class='lu-dialog']/label[${valueNumber}]`);
    }

    // Example method to interact with moreOptions
    async clickMoreOptions(): Promise<void> {
        await this.moreOptions.click();
    }
}

export default MoreFunctionality;
