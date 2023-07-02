import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { Vis } from '../../../LazyVis';
import { ENumericalColorScaleType, EScatterSelectSettings, ESupportedPlotlyVis } from '../../../interfaces';
import { fetchIrisData } from '../../fetchIrisData';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Vis/Scatter',
  component: Vis,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/function-component-definition
const Template: ComponentStory<typeof Vis> = (args) => {
  const columns = React.useMemo(() => fetchIrisData(), []);

  const [selection, setSelection] = useState<string[]>([]);
  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '70%', height: '80%' }}>
        <Vis {...args} columns={columns} selectedList={selection} selectionCallback={setSelection} />
      </div>
    </div>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: typeof Template = Template.bind({}) as typeof Template;
Basic.args = {
  externalConfig: {
    type: ESupportedPlotlyVis.SCATTER,
    numColumnsSelected: [
      {
        description: '',
        id: 'sepalLength',
        name: 'Sepal Length',
      },
      {
        description: '',
        id: 'sepalWidth',
        name: 'Sepal Width',
      },
    ],
    color: null,
    numColorScaleType: ENumericalColorScaleType.SEQUENTIAL,
    shape: null,
    dragMode: EScatterSelectSettings.RECTANGLE,
    alphaSliderVal: 1,
  },
};

export const ColorByCategory: typeof Template = Template.bind({}) as typeof Template;
ColorByCategory.args = {
  externalConfig: {
    type: ESupportedPlotlyVis.SCATTER,
    numColumnsSelected: [
      {
        description: '',
        id: 'sepalLength',
        name: 'Sepal Length',
      },
      {
        description: '',
        id: 'sepalWidth',
        name: 'Sepal Width',
      },
    ],
    color: {
      description: '',
      id: 'species',
      name: 'Species',
    },
    numColorScaleType: ENumericalColorScaleType.SEQUENTIAL,
    shape: null,
    dragMode: EScatterSelectSettings.RECTANGLE,
    alphaSliderVal: 0.5,
  },
};

export const ColorByNumerical: typeof Template = Template.bind({}) as typeof Template;
ColorByNumerical.args = {
  externalConfig: {
    type: ESupportedPlotlyVis.SCATTER,
    numColumnsSelected: [
      {
        description: '',
        id: 'sepalLength',
        name: 'Sepal Length',
      },
      {
        description: '',
        id: 'sepalWidth',
        name: 'Sepal Width',
      },
    ],
    color: {
      description: '',
      id: 'petalLength',
      name: 'Petal Length',
    },
    numColorScaleType: ENumericalColorScaleType.SEQUENTIAL,
    shape: null,
    dragMode: EScatterSelectSettings.RECTANGLE,
    alphaSliderVal: 0.5,
  },
};

export const SmallMultiples: typeof Template = Template.bind({}) as typeof Template;
SmallMultiples.args = {
  externalConfig: {
    type: ESupportedPlotlyVis.SCATTER,
    numColumnsSelected: [
      {
        description: '',
        id: 'sepalLength',
        name: 'Sepal Length',
      },
      {
        description: '',
        id: 'sepalWidth',
        name: 'Sepal Width',
      },
      {
        description: '',
        id: 'petalLength',
        name: 'Petal Length',
      },
    ],
    color: null,
    numColorScaleType: ENumericalColorScaleType.SEQUENTIAL,
    shape: null,
    dragMode: EScatterSelectSettings.RECTANGLE,
    alphaSliderVal: 0.5,
  },
};

export const SankeyPlot: typeof Template = Template.bind({});
SankeyPlot.args = {
  externalConfig: {
    type: ESupportedPlotlyVis.SANKEY,
    catColumnsSelected: [
      {
        description: '',
        id: 'species',
        name: 'Species',
      },
    ],
  },
};
