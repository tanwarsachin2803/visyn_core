import * as React from 'react';
import { BaseConfig, ESupportedPlotlyVis, ICommonVisProps, IVisConfig, VisColumn } from '../interfaces';
import { ScatterVis } from '../scatter/ScatterVis';
import { BarVis, barMergeDefaultConfig } from '../bar';
import { HexbinVis } from '../hexbin/HexbinVis';
import { SankeyVis } from '../sankey/SankeyVis';
import { ViolinVis, violinMergeDefaultConfig } from '../violin';
import { BarVisSidebar } from '../bar/BarVisSidebar';
import { ScatterVisSidebar } from '../scatter/ScatterVisSidebar';
import { HexbinVisSidebar } from '../hexbin/HexbinVisSidebar';
import { SankeyVisSidebar } from '../sankey/SankeyVisSidebar';
import { ViolinVisSidebar } from '../violin/ViolinVisSidebar';
import { scatterMergeDefaultConfig } from '../scatter';
import { hexinbMergeDefaultConfig } from '../hexbin/utils';

interface GeneralVis<T = unknown> {
  type: T;
  renderer: (props: ICommonVisProps<T>) => React.JSX.Element;
  sidebarRenderer: (props) => React.JSX.Element;
  mergeConfig?: (columns: VisColumn[], config: T) => IVisConfig;
}

export function createVis<N extends string, T extends BaseConfig<N>>(
  type: string,
  renderer: (props: ICommonVisProps<T>) => React.JSX.Element,
  sidebarRenderer: (props) => React.JSX.Element,
  mergeConfig?: (columns: VisColumn[], config: T) => IVisConfig,
) {
  const vis = {
    type,
    renderer,
    sidebarRenderer,
    mergeConfig,
  };
  return vis;
}

const visMap: { [key: string]: GeneralVis } = {};
visMap[ESupportedPlotlyVis.BAR] = createVis(ESupportedPlotlyVis.BAR, BarVis, BarVisSidebar, barMergeDefaultConfig);
visMap[ESupportedPlotlyVis.SCATTER] = createVis(ESupportedPlotlyVis.SCATTER, ScatterVis, ScatterVisSidebar, scatterMergeDefaultConfig);
visMap[ESupportedPlotlyVis.HEXBIN] = createVis(ESupportedPlotlyVis.HEXBIN, HexbinVis, HexbinVisSidebar, hexinbMergeDefaultConfig);
visMap[ESupportedPlotlyVis.SANKEY] = createVis(ESupportedPlotlyVis.SANKEY, SankeyVis, SankeyVisSidebar);
visMap[ESupportedPlotlyVis.VIOLIN] = createVis(ESupportedPlotlyVis.VIOLIN, ViolinVis, ViolinVisSidebar, violinMergeDefaultConfig);

export function getVisByConfig<T extends string>(config: BaseConfig<T>) {
  return visMap[config.type];
}
