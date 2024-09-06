import { Page, Locator } from '@playwright/test';
import { ElementRetriever } from '../../../utils/elementRetriever';

class SettingsPage extends ElementRetriever {

    readonly visualizationType: Locator;
    readonly facetsSelectionTab: Locator;
    readonly colorTab: Locator;
    readonly shapeTab: Locator;

    public visualizationTypeOptions: string[];
    public facetsValuesList: string[];

    constructor(page: Page) {
        super(page); // Call the parent constructor
        // Locators
        // Locators
        this.visualizationType = this.getElement('xpath', "(//div[contains(@class,'mantine-Input-wrapper mantine-Select-wrapper')])[2]/input");
        this.facetsSelectionTab = this.getElement('xpath', "(//button[contains(@class,'mantine-Input-input mantine-InputBase-input')])[1]");
        this.colorTab = this.getElement('xpath', "(//button[contains(@class,'mantine-Input-input mantine-InputBase-input')])[2]");
        this.shapeTab = this.getElement('xpath', "(//button[contains(@class,'mantine-Input-input mantine-InputBase-input')])[3]");


        this.visualizationTypeOptions = ['Scatter plot', 'Bar chart', 'Hexbin plot', 'Sankey', 'Heatmap plot', 'Violin plot', 'Box plot', 'Correlation plot']
        this.facetsValuesList = ['breastSurgeryType', 'cellularity', 'chemotherapie', 'pam50Subtype', 'statusER', 'her2Status', 'tumorOtherHistologicSubtype', 'hormoneTherapie'];
    }

    //getting values from the visualisation options
    public getVisualitionType(plotType: string): number {
        const n = this.visualizationTypeOptions.indexOf(plotType);
        return n + 1;
    }

    public getVisualisationTypeValue(plotType: string | number): string {
        if (typeof plotType === 'number') {
            // Ensure the number is a valid index for the array
            if (plotType >= 0 && plotType < this.visualizationTypeOptions.length) {
                return this.visualizationTypeOptions[plotType];
            } else {
                // Return an empty string if the index is out of bounds
                return '';
            }
        } else {
            // When plotType is a string, check if it exists in the array
            const index = this.visualizationTypeOptions.indexOf(plotType);
            return index >= 0 ? this.visualizationTypeOptions[index] : '';
        }
    }

    // get element of plot by name
    public getVisualisationType_element(title: string): Locator {
        return this.getElement('xpath', "//div[@value='" + title + "']");
    }

    // Get facet element
    public getFacetListElement(param: number | string): Locator {
        let value = this.getFacetListValue(param);
        // Return the element using the value
        return this.getElement('xpath', `(//div[contains(@class, 'mantine-Combobox-option') and @value='${value}'])[1]`);
    }
    public getFacetListValue(param: number | string): string {
        // Check if param is a string
        if (typeof param === 'string') {
            return param;
        } else {
            // Ensure the index is valid before accessing the array
            if (param >= 0 && param < this.facetsValuesList.length) {
                return this.facetsValuesList[param] ?? '';  // Access the value at the given index
            } else {
                return '';  // Return empty string if the index is out of bounds
            }
        }
    }

}
export default SettingsPage;


//       //div[contains(@title, '(Un)Select All')]