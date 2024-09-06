import { Page, Locator } from '@playwright/test';
import { ElementRetriever } from '../../../utils/elementRetriever';

class BarchartPage extends ElementRetriever {

    readonly allSections: Locator;
    readonly sectionName: Locator;
    readonly sectionAvailableFunctionality: Locator;
    readonly googleTextarea: Locator;
    readonly apply_button: Locator;
    readonly reset_button: Locator;
    readonly cancel_button: Locator;
    readonly sortButton: Locator;
    public selectAll_Button: Locator;
    public missingValueRowsCheckbox: Locator;
    public UnSelectAllCheckBox: Locator;

    //article[@id='thead-lu-84nT0']/section

    constructor(page: Page) {
        super(page); // Call the parent constructor
        // Locators
        this.allSections = this.getElement('xpath', "//article/section/div[1]");
        this.googleTextarea = this.getElement('xpath', "//textarea[@name='q']");
        this.apply_button = this.getElement('xpath', "(//button[@class='lu-dialog-button'])[1]");
        this.reset_button = this.getElement('xpath', "(//button[@class='lu-dialog-button'])[3]");
        this.cancel_button = this.getElement('xpath', "(//button[@class='lu-dialog-button'])[2]");
        this.selectAll_Button = this.getElement('xpath', "//div[contains(@title, '(Un)Select All')]");
        this.missingValueRowsCheckbox = this.getElement('xpath', "(//div[contains(text(),'missing value rows')]/parent::span)/preceding-sibling::input");
        this.UnSelectAllCheckBox = this.getElement('xpath', "(//div[contains(text(),'Un/Select All')]/parent::span)/preceding-sibling::input");

    }

    //functionality buttons
    async getCommonFunctionalityButton(sectionNumber: number): Promise<Locator> {
        return await this.getElement('xpath', "(//section[contains(@class,'lu-dragable lu-header')])[" + sectionNumber + "]/div[3]/i")
    }

    async getParticularFunctionalityButton(sectionNumber: number, functionalityNumber: number): Promise<Locator> {
        if (functionalityNumber == 3) {
            return await this.getElement('xpath', "(//section[contains(@class,'lu-dragable lu-header')])[" + sectionNumber + "]/div[3]/i[@title='Filter …']")

        }
        else {
            return await this.getElement('xpath', "(//section[contains(@class,'lu-dragable lu-header')])[" + sectionNumber + "]/div[3]/i[" + functionalityNumber + "]")
        }
    }
    // 
    getSectionName(sectionNumber: number): Locator {
        return this.getElement('xpath', `//article/section[${sectionNumber}]/div[1]`);
    }

    getCountFunctionality(sectionNumber: number): Locator {
        return this.getElement('xpath', `//article/section[${sectionNumber}]/div[3]/i`);
    }

    getSectionAvailableFunctionality(sectionNumber: number, functionalityNo: number): Locator {
        return this.getElement('xpath', `//article/section[${sectionNumber}]/div[3]/i[${functionalityNo}]`);
    }

    getSectionColumnValue(sectionNumber: number, columnNumber: number, dataType: string): Locator {
        let element;
        if (dataType.match('number')) {
            element = this.getElement('xpath', `//article[@data-ranking='rank0']/div[${columnNumber}]/div[${sectionNumber}]/div/span`);
        }
        else if (dataType.match('categorical')) {
            element = this.getElement('xpath', `//article[@data-ranking='rank0']/div[${columnNumber}]/div[${sectionNumber}]/div[2]`);
        }
        else {
            element = this.getElement('xpath', `//article[@data-ranking='rank0']/div[${columnNumber}]/div[${sectionNumber}]/div[2]`);
        }
        return element;
    }

    getSectionDataType(sectionName: string): Locator {
        return this.getElement('xpath', `//main/article[@title='${sectionName}']`);
    }

    async getSectionRowValues(sectionNumber: number, row: number): Promise<Locator> {
        return this.getElement('xpath', "//article[@data-ranking='rank0']/div[" + row + "]/div[" + sectionNumber + "]")
    }

}


export default BarchartPage;


//article/section[7]/div[3]/i[1]