import { Page, Locator, ElementHandle } from "playwright-core";
// Define a union type for valid ARIA roles
type AriaRole = | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'checkbox' | 'dialog' | 'document' | 'heading'
    | 'link' | 'listbox' | 'log' | 'main' | 'marquee' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
    | 'navigation' | 'note' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'scrollbar' | 'separator' | 'slider' | 'spinbutton' | 'status'
    | 'switch' | 'tab' | 'table' | 'term' | 'textbox' | 'timer' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem';


export class ElementRetriever {
    constructor(private page: Page) { }

    getElement(typeOfLocator: string, selector: string): Locator {
        switch (typeOfLocator) {
            case 'xpath':
                return this.page.locator(selector); // Use XPath selectors
            case 'label':
                return this.page.getByLabel(selector); // Use aria-label or label text
            case 'placeholder':
                return this.page.getByPlaceholder(selector); // Use placeholder text
            case 'role':
                return this.page.getByRole(selector as AriaRole); // Use ARIA role
            case 'text':
                return this.page.getByText(selector); // Use text content
            case 'title':
                return this.page.getByTitle(selector); // Use title attribute
            default:
                throw new Error(`Unsupported locator type: ${typeOfLocator}`);
        }
    }
}
