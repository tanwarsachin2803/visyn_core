import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import LandingPage from '../e2e-automation/pages/landingPage';
import Barchart from '../e2e-automation/pages/dashboard/components/Barchart';
import MoreFunctionality from '../e2e-automation/utils/more_functionality';
import CommonActions from '../e2e-automation/utils/commonactions';
import SettingsPage from '../e2e-automation/pages/dashboard/components/SettingsPage';

class BarchartTests {
  private page: Page;
  private landingPage: LandingPage;
  private barchartPage: Barchart;
  private actions: CommonActions;
  private countOfSection: number = 0;
  public allFields: Map<number, Map<string, string>> = new Map();
  private moreFunctionality: MoreFunctionality;
  private settings: SettingsPage;
  public sectionDataType: string;

  constructor(page: Page) {
    this.page = page;
    this.landingPage = new LandingPage(page);
    this.barchartPage = new Barchart(page);
    this.actions = new CommonActions();
    this.moreFunctionality = new MoreFunctionality(page);
    this.settings = new SettingsPage(page);
  }

  async setup() {
    await this.page.goto('http://127.0.0.1:8080');
    await this.actions.fillElement(this.landingPage.usernameTextbox, 'admin');
    await this.actions.fillElement(this.landingPage.passwordTextbox, 'admin');
    await this.actions.clickElement(this.landingPage.loginButton);
  }

  async verifySectionCount(): Promise<number> {
    await this.page.waitForSelector('//article/section');
    this.countOfSection = await this.barchartPage.allSections.count();
    console.log(this.countOfSection);
    expect(this.countOfSection).toBe(37);
    console.log('Count of sections:', this.countOfSection);
    return this.countOfSection;
  }

  async storeValuesForSorting() {
    await this.page.waitForSelector('//article/section');
    for (let i = 4; i <= this.countOfSection; i++) {
      this.allFields.set(i, new Map());

      let sectionName = '';
      let moreFunctionality = 'no', sortFunctionality = 'no', filterFunctionality = 'no', groupFunctionality = 'no';
      const countOfFunctionality = await this.barchartPage.getCountFunctionality(i).count();

      sectionName = (await this.barchartPage.getSectionName(i).textContent()) ?? '';
      for (let k = 1; k <= countOfFunctionality; k++) {
        const functionalityTitle = await this.actions.getValueUsingAttribute(this.barchartPage.getSectionAvailableFunctionality(i, k), 'title');
        if (functionalityTitle?.match('Sort')) {
          sortFunctionality = 'yes';
        } else if (functionalityTitle?.match('Filter')) {
          filterFunctionality = 'yes';
        } else if (functionalityTitle?.match('More …')) {
          moreFunctionality = 'yes';
        } else {
          groupFunctionality = 'yes';
        }
      }

      this.allFields.get(i)?.set('Section', sectionName);
      this.allFields.get(i)?.set('Sort', sortFunctionality);
      this.allFields.get(i)?.set('Group', groupFunctionality);
      this.allFields.get(i)?.set('Filter', filterFunctionality);
      this.allFields.get(i)?.set('More', moreFunctionality);
    }
    console.log(this.allFields);
  }

  async clickOnFunction(name: string, functionalityName: string): Promise<void>;
  async clickOnFunction(key: number, functionalityName: string): Promise<void>;

  async clickOnFunction(param: string | number, functionalityName: string): Promise<void> {
    console.log('Again running the clickOnFunction functionality');
    let key: number | undefined;
    let j: number | undefined;
    let sectionName: string | undefined;

    try {
      // Determine key based on the type of param
      if (typeof param === 'string') {
        sectionName = param;
        key = this.getKey(sectionName);
        if (key === undefined) {
          throw new Error(`Section name not found: ${sectionName}`);
        }
      } else {
        key = param;
        sectionName = this.getSectionName(key);
        if (sectionName === undefined) {
          throw new Error(`Section key not found: ${key}`);
        }
      }

      // Determine functionality index based on section data type
      const functionalitiesForNumber = ['Sort', 'Filter', 'More'];
      const functionalitiesForCategory = ['Sort', 'Group', 'Filter', 'More'];
      const functionalitiesForBoolean = ['More'];
      this.sectionDataType = await this.actions.getValueUsingAttribute(this.barchartPage.getSectionDataType(sectionName), 'data-type');
      switch (this.sectionDataType) {
        case 'number':
          j = functionalitiesForNumber.indexOf(functionalityName) + 1;
          break;
        case 'boolean':
          j = functionalitiesForBoolean.indexOf(functionalityName) + 1;
          break;
        case 'categorical':
          j = functionalitiesForCategory.indexOf(functionalityName) + 1;
          break;
        default:
          throw new Error(`Unsupported data type: ${this.sectionDataType}`);
      }

      // Click on the functionality if valid
      if (key !== undefined && j !== undefined && j > 0) {
        console.log(`Key: ${key}, Functionality Index: ${j}`);
        switch (functionalityName) {
          case 'More':
            await this.actions.clickElement(this.barchartPage.getSectionAvailableFunctionality(key, j));
            await this.clickingOnFunctionalities('Sort By … ');
            break;
          default:
            await this.actions.clickElement(this.barchartPage.getSectionAvailableFunctionality(key, j));
            break;
        }
      } else {
        throw new Error(`Functionality index for "${functionalityName}" not found or is invalid.`);
      }
    } catch (error) {
      console.error(`Error in clickOnFunction: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }

  async getSectionDataType(param: string | number): Promise<string> {
    let key: number | undefined;
    let sectionName;
    if (typeof param === 'string') {
      sectionName = param;
      key = this.getKey(sectionName);
      if (key === undefined) {
        throw new Error(`Section name not found: ${sectionName}`);
      }
    } else {
      key = param;
      sectionName = this.getSectionName(key);
      if (sectionName === undefined) {
        throw new Error(`Section key not found: ${key}`);
      }
    }
    this.sectionDataType = await this.actions.getValueUsingAttribute(this.barchartPage.getSectionDataType(sectionName), 'data-type');
    return this.sectionDataType;
  }

  async validLogin() {
    console.log(this.allFields);
  }

  private getKey(val: string): number | undefined {
    for (const [key, innerMap] of this.allFields) {
      if (innerMap.get('Section') === val) {
        return key;
      }
    }
    return undefined;
  }

  private getSectionName(keyValue: number): string | undefined {
    const innerMap = this.allFields.get(keyValue);
    if (innerMap) {
      return innerMap.get('Section');
    }
    return undefined;
  }

  async clickingOnFunctionalities(actionTakenOnList: string) {
    try {
      console.log("Checking the more options list");
      await this.moreFunctionality.setMoreFunctionalityOptions(this.moreFunctionality.moreOptions);

      let locator;
      switch (actionTakenOnList) {
        case 'Sort By … ':
          await this.settingValues(actionTakenOnList);
          await this.sortingOrder('Descending');
          await this.takeActions('apply');
          break;
        case 'Group By … ':
          locator = this.moreFunctionality.getMoreOptionsFunctionality(actionTakenOnList);
          if (!locator) throw new Error(`Functionality "${actionTakenOnList}" not found`);
          await this.actions.clickElement(locator);
          await this.moreFunctionality.setMoreOptionsFunctionalityList();
          break;
        case 'Sort Groups By … ':
          locator = this.moreFunctionality.getMoreOptionsFunctionality(actionTakenOnList);
          if (!locator) throw new Error(`Functionality "${actionTakenOnList}" not found`);
          await this.actions.clickElement(locator);
          await this.moreFunctionality.setMoreOptionsFunctionalityList();
          break;
        default:
          throw new Error(`Unsupported action: ${actionTakenOnList}`);
      }
    } catch (error) {
      console.error(`Error in clickingOnFunctionalities: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }

  async settingValues(actionTakenOnList: string) {
    try {
      const locator = this.moreFunctionality.getMoreOptionsFunctionality(actionTakenOnList);
      await this.actions.clickElement(locator);
      await this.moreFunctionality.setMoreOptionsFunctionalityList();
    } catch (error) {
      console.error(`Error in settingValues: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }

  async sortingOrder(order: string) {
    try {
      const locator = this.moreFunctionality.getTypeOfActionWithinTheFunctionality(order);
      await this.actions.clickElement(locator);
    } catch (error) {
      console.error(`Error in sortingOrder: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }

  async takeActions(actionType: string) {
    try {
      const action = actionType.toLowerCase();
      switch (action) {
        case 'apply':
          await this.actions.clickElement(this.barchartPage.apply_button);
          break;
        case 'cancel':
          await this.actions.clickElement(this.barchartPage.cancel_button);
          break;
        case 'reset':
          await this.actions.clickElement(this.barchartPage.reset_button);
          break;
        default:
          throw new Error(`Unsupported action type: ${actionType}`);
      }
    } catch (error) {
      console.error(`Error in takeActions: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }



  //all major functionality
  async clickingSortingFunctionality(sectionNumber: number) {
    try {
      const count = await (await (this.barchartPage.getCommonFunctionalityButton(sectionNumber))).count();
      if (count >= 3) {
        await this.page.waitForTimeout(5);
        await this.actions.clickElement(await this.barchartPage.getParticularFunctionalityButton(sectionNumber, 1));
      }
    }
    catch (expect) { console.log("element not found"); }
  }

  async clickingFilterFunctionality(sectionNumber: number) {
    try {
      const count = await (await (this.barchartPage.getCommonFunctionalityButton(sectionNumber))).count();
      if (count >= 3) {
        await this.page.waitForTimeout(5);
        const locator= await this.barchartPage.getParticularFunctionalityButton(sectionNumber, 3);       
        console.error(`Element selector: ${await locator.evaluate(el => el.outerHTML)}`);
        await this.actions.clickElement(await this.barchartPage.getParticularFunctionalityButton(sectionNumber, 3));
      }
    }
    catch (expect) { console.log("element not found"); }
  }

  async clickingGroupFunctionality(sectionNumber: number) {
    try {
      const count = await (await (this.barchartPage.getCommonFunctionalityButton(sectionNumber))).count();
      if (count > 3) {
        await this.page.waitForTimeout(5);
        await this.actions.clickElement(await this.barchartPage.getParticularFunctionalityButton(sectionNumber, 2));
      }
    }
    catch (expect) { console.log("element not found"); }
  }

  async gettingRowTextValues(sectionNumber: number, columnNumber: number): Promise<string | number> {
    try {
      // Retrieve the section name and data type
      const sectionName = this.getSectionName(sectionNumber) ?? '';
      const sectionDataType = await this.actions.getValueUsingAttribute(this.barchartPage.getSectionDataType(sectionName), 'data-type');
      // Retrieve the column value locator and its text content
      const columnValue = await this.barchartPage.getSectionColumnValue(sectionNumber, columnNumber, sectionDataType);
      const textContent = await (columnValue.textContent()) ?? '';
      console.log(textContent);

      if (textContent === null) {
        throw new Error('Text content is null');
      }
      // Try to parse the text content to a number if applicable
      const numberValue = parseFloat(textContent);
      if (sectionDataType === 'number' && !isNaN(numberValue)) {
        return numberValue;  // Return number if the data type is number and parsing is successful
      } else {
        return textContent;  // Return string if not a number or data type is not number
      }
    } catch (error) {
      console.error(`Error getting row text values: ${error.message}`);
      throw error;  // Re-throw the error after logging it
    }
  }

  async verifyingTheSortFunctionality(listValues: (number | string)[], sortingOrder: string): Promise<void> {
    // Create a copy of the list to sort
    const sortedValues: (number | string)[] = [...listValues];

    // Determine the type of the elements in the list for sorting
    const isNumberArray = typeof listValues[0] === 'number';

    // Sort the list based on the sorting order
    if (sortingOrder.match(/Ascending/i)) {
      if (isNumberArray) {
        sortedValues.sort((a, b) => (a as number) - (b as number));
      } else {
        sortedValues.sort(); // Default lexicographical sort for strings
      }
    } else if (sortingOrder.match(/Descending/i)) {
      if (isNumberArray) {
        sortedValues.sort((a, b) => (b as number) - (a as number));
      } else {
        sortedValues.sort().reverse(); // Reverse the default lexicographical sort for strings
      }
    } else {
      throw new Error(`Unsupported sorting order: ${sortingOrder}`);
    }

    console.log('Expected Sorted Values:', sortedValues);
    console.log('Actual Values:', listValues);

    // Assert that the original list matches the sorted list
    try {
      expect(listValues).toEqual(sortedValues);
      console.log("List is sorted correctly");
    } catch (error) {
      console.error("List is not sorted correctly");
      console.error("Error:", error.message);
      throw error;  // Re-throw the error to fail the test
    }
  }

  async verifyingTheGroupFunctionality(listValues: (number | string)[]): Promise<void> {
    if (listValues.length === 0) {
      throw new Error("The list is empty.");
  }
  const firstValue = listValues[0];
  const allSame = listValues.every(value => value === firstValue);
  try {
      expect(allSame).toBe(true);
      console.log("All values in the list are the same.");
  } catch (error) {
      console.error("Not all values in the list are the same.");
      console.error("Error:", error.message);
      throw error;  // Re-throw the error to fail the test
  }
}



  async selectingVisualisationType(plotName: string) {
    await this.page.waitForTimeout(5000);  // Wait for 5 seconds
    //await this.page.waitForSelector("(//div[contains(@class,'mantine-Input-wrapper mantine-Select-wrapper')])[2]", { state: 'visible' });
    await this.actions.clickElement(this.settings.visualizationType);
    await this.actions.clickElement(this.settings.getVisualisationType_element(plotName));
    await expect(this.actions.getValueUsingAttribute(this.settings.visualizationType, 'value')).toBe(plotName);
  }

  async applyMissingValueFilter()
  {
    await this.actions.clickElement(this.barchartPage.missingValueRowsCheckbox);
    this.takeActions('apply');
  }

  async applyUnSelectAllFilter()
  {
    await this.actions.clickElement(this.barchartPage.UnSelectAllCheckBox);
    this.takeActions('apply');
  }
}

export default BarchartTests;
