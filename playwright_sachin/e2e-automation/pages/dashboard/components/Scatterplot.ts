import { Page, Locator } from '@playwright/test';
import { ElementRetriever } from '../../../utils/elementRetriever';

class ScatterPlot extends ElementRetriever {

    readonly plot:Locator;
    

    constructor(page: Page) {
        super(page); // Call the parent constructor
        // Locators
        this.plot=this.getElement('xpath',"//div[@style='--stack-gap: 0rem; --stack-align: stretch; --stack-justify: flex-start; width: 100%; height: 100%; overflow: hidden;']");
    }
}

export default ScatterPlot;
