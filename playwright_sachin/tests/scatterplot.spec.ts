import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import BarchartTests from '../testfiles/barchartTest';
import Settings from '../e2e-automation/pages/dashboard/components/SettingsPage'
import SettingTest from '../testfiles/settingTest';
import ScatterPlotTest from '../testfiles/scatterplotTest';
import ScatterPlot from '../e2e-automation/pages/dashboard/components/ScatterPlot';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let barchartTests: BarchartTests;
let settingspage:Settings;
let settingTest:SettingTest;
let scatterplottest:ScatterPlotTest;

test.beforeEach(async ({ browser: b }) => {
    browser = b;
    context = await browser.newContext();
    page = await context.newPage();
    barchartTests = new BarchartTests(page);
    settingspage=new Settings(page);
    settingTest=new SettingTest(page);
    scatterplottest=new ScatterPlotTest(page);
    
    await barchartTests.setup();
    //listRowValues=[];
});

//get the ss and store it in the folder
test('Get the screen shots ',async ()=>{
  for(let i=0;i<settingspage.facetsValuesList.length;i++){
    await scatterplottest.takeSsOfTheGraphs('Scatter Plot','facet',i);}
 
});

 test('Checking the verifying the graphs',async ()=>{
  await  scatterplottest.verifyTheGraphs('Scatter plot');
})

test('Verifying the Scatter plot with different facets',async ()=>{
  for(let i=0;i<settingspage.facetsValuesList.length;i++){
  await  scatterplottest.verifyingGraphWithFacets(i);}
})

test('Verifying the Scatter plot with different color',async ()=>{
  for(let i=0;i<settingspage.facetsValuesList.length;i++){
  await  scatterplottest.verifyingGraphWithColor(i);}
})

test('Verifying the Scatter plot with different shape',async ()=>{
  for(let i=0;i<settingspage.facetsValuesList.length;i++){
  await  scatterplottest.verifyingGraphWithShape(i);}
})