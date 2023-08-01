import { MantineTheme, useMantineTheme } from '@mantine/core';
import { uniqueId } from 'lodash';
import * as React from 'react';
import { useAsync } from '../../hooks/useAsync';
import { PlotlyComponent } from '../../plotly';
import { resolveColumnValues } from '../general/layoutUtils';
import { ICommonVisProps, ISankeyConfig, VisCategoricalColumn, VisColumn } from '../interfaces';

const layout = {
  font: {
    size: 12,
  },
};

/**
 * Performs the data transformation that maps the fetched data to
 * a Plotly.js compatible format
 *
 * @param data the fetched data
 * @returns a plotly spec
 */
function TransposeData(
  data: {
    info: { description: string; id: string; name: string };
    resolvedValues: {
      id: string;
      val: unknown;
    }[];
  }[],
) {
  let nodeIndex = 0;

  const plotly = {
    nodes: {
      labels: new Array<string>(),
      inverseLookup: [],
    },
    links: {
      source: new Array<number>(),
      target: new Array<number>(),
      value: new Array<number>(),
      inverseLookup: [],
    },
  };

  if (data.length < 2) {
    return null;
  }

  const lanes = data.map((lane) => {
    const values = lane.resolvedValues.map((value) => value.val as string);
    // const nodes = Array.from(new Set(values)).map((value) => ({id: nodeIndex++, value}))
    const nodes = new Array<{ id: number; value; inverseLookup: string[] }>();

    const nodesSet = new Set<string>();
    lane.resolvedValues.forEach((value) => {
      if (nodesSet.has(value.val as string)) {
        nodes.find((node) => node.value === value.val).inverseLookup.push(value.id);
      } else {
        nodes.push({ id: nodeIndex++, value: value.val, inverseLookup: [value.id] });
        nodesSet.add(value.val as string);
      }
    });

    for (const node of nodes) {
      plotly.nodes.labels.push(node.value);
      plotly.nodes.inverseLookup.push(node.inverseLookup);
    }

    return {
      info: lane.info,
      nodes,
      values,
    };
  });

  lanes.forEach((lane, i) => {
    if (i === lanes.length - 1) {
      return;
    }

    const next = lanes[i + 1];
    const links: { [index: string]: { [index: string]: { count: number; inverseLookup: string[] } } } = {};

    lane.values.forEach((left, vi) => {
      const right = next.values[vi];

      if (left in links) {
        if (right in links[left]) {
          links[left][right].count += 1;
          links[left][right].inverseLookup.push(vi.toString());
        } else {
          links[left][right] = { count: 1, inverseLookup: [vi.toString()] };
        }
      } else {
        links[left] = {
          [right]: {
            count: 1,
            inverseLookup: [vi.toString()],
          },
        };
      }
    });

    for (const lik in links) {
      if (Object.prototype.hasOwnProperty.call(links, lik)) {
        for (const rik in links[lik]) {
          if (Object.prototype.hasOwnProperty.call(links[lik], rik)) {
            plotly.links.source.push(lane.nodes.find((node) => node.value === lik).id);
            plotly.links.target.push(next.nodes.find((node) => node.value === rik).id);
            plotly.links.value.push(links[lik][rik].count);
            plotly.links.inverseLookup.push(links[lik][rik].inverseLookup);
          }
        }
      }
    }
  });

  return plotly;
}

export async function fetchData(columns: VisColumn[], config: ISankeyConfig) {
  const catCols: VisCategoricalColumn[] = config.catColumnsSelected.map((c) => columns.find((col) => col.info.id === c.id) as VisCategoricalColumn);
  const catColValues2 = await resolveColumnValues(catCols);

  return TransposeData(catColValues2);
}

function isNodeSelected(selection: Set<string>, inverseLookup: Array<string>) {
  for (const value of inverseLookup) {
    if (selection.has(value)) {
      return true;
    }
  }

  return false;
}

function generatePlotly(data, optimisedSelection, theme: MantineTheme) {
  const selected = theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  const def = theme.colors.gray[4];

  return [
    {
      type: 'sankey',
      arrangement: 'fixed',
      orientation: 'h',
      node: {
        pad: 15,
        thickness: 30,
        line: {
          color: 'black',
          width: 0.5,
        },
        label: data.nodes.labels,
        color: data.nodes.labels.map((_, i) => (isNodeSelected(optimisedSelection, data.nodes.inverseLookup[i]) ? selected : def)),
      },
      link: {
        ...data.links,
        color: data.links.value.map((_, i) => (isNodeSelected(optimisedSelection, data.links.inverseLookup[i]) ? selected : def)),
      },
    },
  ];
}

export function SankeyVis({ config, columns, selectedList, selectedMap, selectionCallback }: ICommonVisProps<ISankeyConfig>) {
  const id = React.useMemo(() => uniqueId('SankeyVis'), []);

  const [selection, setSelection] = React.useState<string[]>([]);

  const { value: data } = useAsync(fetchData, [columns, config]);

  const [plotly, setPlotly] = React.useState<unknown[]>();

  const theme = useMantineTheme();

  // When we have new data -> recreate plotly
  React.useEffect(() => {
    const optimisedSelection = new Set(selection);

    if (!data) {
      setPlotly(null);
    } else {
      setPlotly(generatePlotly(data, optimisedSelection, theme));
    }
  }, [selection, data, theme]);

  React.useEffect(() => {
    setSelection(selectedList);
  }, [selectedList]);

  return (
    <div className="d-flex flex-row w-100 h-100" style={{ minHeight: '0px' }}>
      <div className={`position-relative d-flex justify-content-center align-items-center flex-grow-1 `}>
        {plotly ? (
          <PlotlyComponent
            divId={`plotlyDiv${id}`}
            data={plotly}
            layout={layout}
            onClick={(sel) => {
              if (!sel.points[0]) {
                return;
              }

              const element = sel.points[0] as (typeof sel.points)[0] & { index: number };

              if ('sourceLinks' in element) {
                selectionCallback(data.nodes.inverseLookup[element.index]);
              } else {
                selectionCallback(data.links.inverseLookup[element.index]);
              }
            }}
          />
        ) : (
          <p className="h4">Select at least 2 categorical attributes.</p>
        )}
      </div>
    </div>
  );
}
