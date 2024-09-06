import { Locator, expect } from '@playwright/test';

class CommonActions {

    async clickElement(locator: Locator): Promise<void> {
        try {
            console.info(`Element selector: ${await locator.evaluate(el => el.outerHTML)}`);
            // Ensure the element is visible and enabled before clicking
            await locator.waitFor({ state: 'visible', timeout: 2000 });
            await locator.waitFor({ state: 'attached', timeout: 2000 });  // Ensure it's in the DOM
            // Perform the click action
            await locator.click();
        } catch (error) {
            // Detailed error logging
            console.error(`Error clicking element: ${error.message}`);
            console.error(`Element selector: ${await locator.evaluate(el => el.outerHTML)}`);
            throw error;  // Re-throw the error after logging it
        }
    }


    async fillElement(locator: Locator, text: string): Promise<void> {
        try {
            // Ensure the element is visible and enabled before clicking
            await locator.waitFor({ state: 'visible', timeout: 2000 });
            await locator.waitFor({ state: 'attached', timeout: 2000 });  // Ensure it's in the DOM
            await locator.fill(text);
        } catch (error) {
            console.error(`Error filling element with text "${text}": ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    async getElements(locator: Locator): Promise<Locator[]> {
        try {
            // Returns a list of elements matching the locator
            return await locator.locator('*').all();
        } catch (error) {
            console.error(`Error getting elements: ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    async checkElement(locator: Locator): Promise<void> {
        try {
            if (!(await locator.isChecked())) {
                console.log("Not checked");
                await locator.check();
            }
        } catch (error) {
            console.error(`Error checking element: ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    async uncheckElement(locator: Locator): Promise<void> {
        try {
            if (await locator.isChecked()) {
                console.log("Already checked");
                await locator.uncheck();
            }
        } catch (error) {
            console.error(`Error unchecking element: ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    async sortingData(locator: Locator, dataType: string): Promise<void> {
        try {
            let dataTypeOfLocator = await this.getValueUsingAttribute(locator, 'data-sort');
            while (dataTypeOfLocator !== dataType) {
                await this.clickElement(locator);
                dataTypeOfLocator = await this.getValueUsingAttribute(locator, 'data-sort');
            }
        } catch (error) {
            console.error(`Error sorting data: ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    async getValueUsingAttribute(locator: Locator, attributeName: string): Promise<string> {
        try {

            const attributeValue = await locator.
                getAttribute(attributeName);
            return attributeValue ?? ''; // Provide a fallback value
        } catch (error) {
            console.error(`Error getting attribute "${attributeName}": ${error.message}`);
            throw error;  // Re-throw the error after logging it
        }
    }

    // Assertion methods without try-catch
    async assertVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    async assertNotVisible(locator: Locator): Promise<void> {
        await expect(locator).not.toBeVisible();
    }

    async assertEnabled(locator: Locator): Promise<void> {
        await expect(locator).toBeEnabled();
    }

    async assertDisabled(locator: Locator): Promise<void> {
        await expect(locator).toBeDisabled();
    }

    async assertSelected(locator: Locator): Promise<void> {
        await expect(locator).toBeChecked();
    }

    async assertNotSelected(locator: Locator): Promise<void> {
        await expect(locator).not.toBeChecked();
    }

    async assertTrue(locator: Locator): Promise<void> {
        await expect(locator).toBeChecked();
    }
}

export default CommonActions;
