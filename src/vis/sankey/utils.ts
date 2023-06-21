import { merge } from 'lodash';
import { ESupportedPlotlyVis, ISankeyConfig, IVisConfig, VisColumn } from '../interfaces';

const defaultConfig: ISankeyConfig = {
  type: ESupportedPlotlyVis.SANKEY,
  catColumnsSelected: [],
};

export function sankeyMergeDefaultConfig(columns: VisColumn[], config: ISankeyConfig): IVisConfig {
  const merged = merge({}, defaultConfig, config);
  return merged;
}
