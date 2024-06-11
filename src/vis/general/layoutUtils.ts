import { ColumnInfo, PlotlyInfo, VisColumn } from '../interfaces';
import { PlotlyTypes } from '../../plotly';
import { VIS_AXIS_LABEL_SIZE, VIS_AXIS_LABEL_SIZE_SMALL, VIS_GRID_COLOR, VIS_LABEL_COLOR, VIS_TICK_LABEL_SIZE, VIS_TICK_LABEL_SIZE_SMALL } from './constants';

/**
 * Truncate long texts (e.g., to use as axes title)
 * @param text Input text to be truncated
 * @param maxLength Maximum text length (default: 50)
 */
export function truncateText(text: string, maxLength = 50) {
  return text?.length > maxLength ? `${text.substring(0, maxLength)}\u2026` : text;
}

export function columnNameWithDescription(col: ColumnInfo) {
  return col?.description ? `${col.name}: ${col.description}` : col.name;
}

/**
 * Cleans up the layout of a given trace, primarily by positioning potential small multiple plots in a reasonable way
 * @param traces the traces associated with the layout
 * @param layout the current layout to be changed. Typed to any because the plotly types complain.p
 * @returns the changed layout
 */
export function beautifyLayout(traces: PlotlyInfo, layout: Partial<PlotlyTypes.Layout>, oldLayout: Partial<PlotlyTypes.Layout>, automargin = true) {
  layout.annotations = [];
  const titlePlots = traces.plots.filter((value, index, self) => {
    return value.title && self.findIndex((v) => v.title === value.title) === index;
  });

  // This is for adding titles to subplots, specifically for bar charts with small facets.
  // As explained here https://github.com/plotly/plotly.js/issues/2746#issuecomment-810354140, this doesnt work very well if you have a lot of subplots because plotly.
  // "So above and beyond the fact that Plotly.js doesn't have a first-class "subplot" concept,
  // Plotly.js also doesn't really do any kind of automated layout beyond automatically growing the plot margins to leave enough room for legends"

  // We should stop using plotly for a component like this one which wants a lot of unique functionality, and does not require complex rendering logic (like a canvas)

  titlePlots.forEach((t) => {
    if (t.title) {
      layout.annotations.push({
        text: t.title,
        showarrow: false,
        x: 0.5,
        y: 1.1,
        // @ts-ignore
        xref: `${t.data.xaxis} domain`,
        // @ts-ignore
        yref: `${t.data.yaxis} domain`,
      });
    }
  });

  traces.plots.forEach((t, i) => {
    const axisX = t.data.xaxis?.replace('x', 'xaxis') || 'xaxis';
    layout[axisX] = {
      range: t.xDomain ? t.xDomain : null,
      ...oldLayout?.[`xaxis${i > 0 ? i + 1 : ''}`],
      color: VIS_LABEL_COLOR,
      gridcolor: VIS_GRID_COLOR,
      zerolinecolor: VIS_GRID_COLOR,
      automargin,
      tickvals: t.xTicks,
      ticktext: t.xTickLabels,
      tickfont: {
        size: traces.plots.length > 1 ? VIS_TICK_LABEL_SIZE_SMALL : VIS_TICK_LABEL_SIZE,
      },
      ticks: 'none',
      text: t.xTicks,
      showspikes: false,
      spikedash: 'dash',
      title: {
        standoff: 5,
        text: traces.plots.length > 1 ? truncateText(t.xLabel, 20) : truncateText(t.xLabel, 55),
        font: {
          family: 'Roboto, sans-serif',
          size: traces.plots.length > 1 ? VIS_AXIS_LABEL_SIZE_SMALL : VIS_AXIS_LABEL_SIZE,
          color: VIS_LABEL_COLOR,
        },
      },
    };

    const axisY = t.data.yaxis?.replace('y', 'yaxis') || 'yaxis';
    layout[axisY] = {
      range: t.yDomain ? t.yDomain : null,
      ...oldLayout?.[`yaxis${i > 0 ? i + 1 : ''}`],
      automargin,
      color: VIS_LABEL_COLOR,
      gridcolor: VIS_GRID_COLOR,
      zerolinecolor: VIS_GRID_COLOR,
      tickvals: t.yTicks,
      ticktext: t.yTickLabels,
      tickfont: {
        size: traces.plots.length > 1 ? VIS_TICK_LABEL_SIZE_SMALL : VIS_TICK_LABEL_SIZE,
      },
      ticks: 'none',
      text: t.yTicks,
      showspikes: false,
      spikedash: 'dash',
      title: {
        standoff: 5,
        text: traces.plots.length > 1 ? truncateText(t.yLabel, 20) : truncateText(t.yLabel, 55),
        font: {
          family: 'Roboto, sans-serif',
          size: traces.plots.length > 1 ? VIS_AXIS_LABEL_SIZE_SMALL : VIS_AXIS_LABEL_SIZE,
          color: VIS_LABEL_COLOR,
          weight: 'bold',
        },
      },
    };
  });

  return layout;
}

export function resolveColumnValues(columns: VisColumn[]) {
  return Promise.all(columns.map(async (col) => ({ ...col, resolvedValues: (await col?.values()) || [] })));
}

export async function resolveSingleColumn(column: VisColumn) {
  if (!column) {
    return null;
  }
  return {
    ...column,
    resolvedValues: await column.values(),
  };
}

/**
 * Creates mapping function from label column. If more label columns are provided, the first one is used, the rest are used as fallback.
 * @param {VisColumn[]} columns - The columns to map.
 * @returns {Function} Function mapping ID to label or ID itself.
 */
export async function createIdToLabelMapper(columns: VisColumn[]): Promise<(id: string) => string> {
  const labelColumns = (await resolveColumnValues(columns.filter((c) => c.isLabel))).map((c) => c.resolvedValues);
  const labelsMap = labelColumns.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (acc[obj.id] == null) {
        acc[obj.id] = obj.val;
      }
    });
    return acc;
  }, {});
  return (id: string) => labelsMap[id] ?? id;
}
