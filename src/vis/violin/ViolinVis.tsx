import * as React from 'react';
import * as d3v7 from 'd3v7';
import merge from 'lodash/merge';
import uniqueId from 'lodash/uniqueId';
import { useEffect, useState } from 'react';
import { ActionIcon, Container, Group, Space, Stack, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { Scales, VisColumn, IVisConfig, IViolinConfig, EFilterOptions } from '../interfaces';
import { PlotlyComponent, PlotlyTypes } from '../../plotly';
import { Plotly } from '../../plotly/full';
import { InvalidCols } from '../general';
import { beautifyLayout } from '../general/layoutUtils';
import { createViolinTraces } from './utils';
import { useAsync } from '../../hooks';
import { ViolinVisSidebar } from './ViolinVisSidebar';
import { VisSidebarWrapper } from '../VisSidebarWrapper';
import { CloseButton } from '../sidebar/CloseButton';
import { i18n } from '../../i18n';
import { VisSidebarOpenButton } from '../VisSidebarOpenButton';
import { VisFilterAndSelectSettings } from '../VisFilterAndSelectSettings';

const defaultExtensions = {
  prePlot: null,
  postPlot: null,
  preSidebar: null,
  postSidebar: null,
};

export function ViolinVis({
  config,
  optionsConfig,
  extensions,
  columns,
  setConfig,
  scales,
  showSidebar,
  setShowSidebar,
  selectedList,
  selectedMap,
  selectionCallback,
  enableSidebar,
  showCloseButton = false,
  filterCallback = () => null,
  closeButtonCallback = () => null,
  showDragModeOptions = true,
}: {
  config: IViolinConfig;
  optionsConfig?: {
    overlay?: {
      enable?: boolean;
      customComponent?: React.ReactNode;
    };
  };
  extensions?: {
    prePlot?: React.ReactNode;
    postPlot?: React.ReactNode;
    preSidebar?: React.ReactNode;
    postSidebar?: React.ReactNode;
  };
  filterCallback?: (s: EFilterOptions) => void;
  columns: VisColumn[];
  setConfig: (config: IVisConfig) => void;
  closeButtonCallback?: () => void;
  selectionCallback: (ids: string[]) => void;

  selectedMap: { [key: string]: boolean };
  selectedList: string[];
  scales: Scales;
  showSidebar?: boolean;
  setShowSidebar?(show: boolean): void;
  enableSidebar?: boolean;
  showCloseButton?: boolean;
  showDragModeOptions?: boolean;
}) {
  const mergedExtensions = React.useMemo(() => {
    return merge({}, defaultExtensions, extensions);
  }, [extensions]);

  const { value: traces, status: traceStatus, error: traceError } = useAsync(createViolinTraces, [columns, config, scales, selectedList, selectedMap]);

  const id = React.useMemo(() => uniqueId('ViolinVis'), []);

  const [layout, setLayout] = useState<Partial<Plotly.Layout>>(null);

  const plotlyDivRef = React.useRef(null);

  const onClick = (e: Readonly<PlotlyTypes.PlotSelectionEvent> | null) => {
    if (!e || !e.points || !e.points[0]) {
      selectionCallback([]);
      return;
    }

    // @ts-ignore
    const shiftPressed = e.event.shiftKey;
    // @ts-ignore
    const eventIds = e.points[0]?.fullData.ids;

    // Multiselect enabled
    if (shiftPressed) {
      // Filter out incoming ids in order to deselect violin/box element
      const newSelected = selectedList.filter((s) => !eventIds.includes(s));

      // If incoming ids were not in selected already, add them
      if (newSelected.length === selectedList.length) {
        newSelected.push(...eventIds);
      }

      selectionCallback(newSelected);
    }
    // Multiselect disabled
    else if (selectedList.length === eventIds.length && eventIds.every((tempId) => selectedMap[tempId])) {
      selectionCallback([]);
    } else {
      selectionCallback(eventIds);
    }
  };

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const plotDiv = document.getElementById(`plotlyDiv${id}`);
      if (plotDiv) {
        Plotly.Plots.resize(plotDiv);
      }
    });

    if (plotlyDivRef) {
      ro.observe(plotlyDivRef.current);
    }

    return () => ro.disconnect();
  }, [id, plotlyDivRef]);

  React.useEffect(() => {
    if (!traces) {
      return;
    }

    const innerLayout: Partial<Plotly.Layout> = {
      showlegend: true,
      legend: {
        // @ts-ignore
        itemclick: false,
        itemdoubleclick: false,
      },
      margin: {
        t: 25,
        r: 25,
        l: 25,
        b: 25,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      clickmode: 'event+select',
      autosize: true,
      grid: { rows: traces.rows, columns: traces.cols, xgap: 0.3, pattern: 'independent' },
      shapes: [],
    };

    setLayout({ ...layout, ...beautifyLayout(traces, innerLayout, layout, true) });
    // WARNING: Do not update when layout changes, that would be an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traces]);

  return (
    <Group
      noWrap
      pl={0}
      pr={0}
      spacing={0}
      sx={{
        flexGrow: 1,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        // Disable plotly crosshair cursor
        '.nsewdrag': {
          cursor: 'pointer !important',
        },
      }}
      ref={plotlyDivRef}
    >
      {enableSidebar ? <VisSidebarOpenButton onClick={() => setShowSidebar(!showSidebar)} isOpen={showSidebar} /> : null}

      <Stack
        spacing={0}
        sx={{
          flexGrow: 1,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {showDragModeOptions ? (
          <Group mt="md" position="center" style={{ width: '100%' }}>
            <VisFilterAndSelectSettings onBrushOptionsCallback={null} onFilterCallback={filterCallback} dragMode={null} showSelect={false} />
          </Group>
        ) : null}
        <Space h="xl" />
        {showCloseButton ? <CloseButton closeCallback={closeButtonCallback} /> : null}

        {traceStatus === 'success' && layout && traces?.plots.length > 0 ? (
          <PlotlyComponent
            divId={`plotlyDiv${id}`}
            data={[...traces.plots.map((p) => p.data), ...traces.legendPlots.map((p) => p.data)]}
            layout={layout}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
            onClick={onClick}
            // plotly redraws everything on updates, so you need to reappend title and
            onUpdate={() => {
              for (const p of traces.plots) {
                d3v7.select(`g .${p.data.xaxis}title`).style('pointer-events', 'all').append('title').text(p.xLabel);

                d3v7.select(`g .${p.data.yaxis}title`).style('pointer-events', 'all').append('title').text(p.yLabel);
              }
            }}
          />
        ) : traceStatus !== 'pending' && traceStatus !== 'idle' && layout ? (
          <InvalidCols headerMessage={traces?.errorMessageHeader} bodyMessage={traceError?.message || traces?.errorMessage} />
        ) : null}
        {mergedExtensions.postPlot}
      </Stack>
      {showSidebar ? (
        <VisSidebarWrapper>
          <ViolinVisSidebar config={config} optionsConfig={optionsConfig} extensions={extensions} columns={columns} setConfig={setConfig} />
        </VisSidebarWrapper>
      ) : null}
    </Group>
  );
}
