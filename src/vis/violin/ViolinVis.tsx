import * as React from 'react';
import * as d3v7 from 'd3v7';
import merge from 'lodash/merge';
import uniqueId from 'lodash/uniqueId';
import { useEffect, useState } from 'react';
import { ActionIcon, Container, Space, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Scales, VisColumn, IVisConfig, IViolinConfig } from '../interfaces';
import { PlotlyComponent } from '../../plotly';
import { Plotly } from '../../plotly/full';
import { InvalidCols } from '../general';
import { beautifyLayout } from '../general/layoutUtils';
import { createViolinTraces } from './utils';
import { useAsync } from '../../hooks';
import { ViolinVisSidebar } from './ViolinVisSidebar';
import { VisSidebarWrapper } from '../VisSidebarWrapper';
import { CloseButton } from '../sidebar/CloseButton';
import { I18nextManager } from '../../i18n';

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
  enableSidebar,
  showCloseButton = false,
  closeButtonCallback = () => null,
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
  columns: VisColumn[];
  setConfig: (config: IVisConfig) => void;
  closeButtonCallback?: () => void;

  scales: Scales;
  showSidebar?: boolean;
  setShowSidebar?(show: boolean): void;
  enableSidebar?: boolean;
  showCloseButton?: boolean;
}) {
  const mergedExtensions = React.useMemo(() => {
    return merge({}, defaultExtensions, extensions);
  }, [extensions]);

  const { value: traces, status: traceStatus, error: traceError } = useAsync(createViolinTraces, [columns, config, scales]);

  const id = React.useMemo(() => uniqueId('ViolinVis'), []);

  const [layout, setLayout] = useState<Partial<Plotly.Layout>>(null);

  const plotlyDivRef = React.useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      Plotly.Plots.resize(document.getElementById(`plotlyDiv${id}`));
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
      autosize: true,
      grid: { rows: traces.rows, columns: traces.cols, xgap: 0.3, pattern: 'independent' },
      shapes: [],
    };

    setLayout({ ...layout, ...beautifyLayout(traces, innerLayout, layout) });
    // WARNING: Do not update when layout changes, that would be an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traces]);

  return (
    <Container
      fluid
      pl={0}
      pr={0}
      sx={{
        flexGrow: 1,
        height: '100%',
        width: '100%',
        position: 'relative',
        // Disable plotly crosshair cursor
        '.nsewdrag': {
          cursor: 'pointer !important',
        },
      }}
      ref={plotlyDivRef}
    >
      <Space h="xl" />
      {showCloseButton ? <CloseButton closeCallback={closeButtonCallback} /> : null}

      {enableSidebar ? (
        <Tooltip withinPortal label={I18nextManager.getInstance().i18n.t('tdp:core.vis.openSettings')}>
          <ActionIcon sx={{ zIndex: 10, position: 'absolute', top: '10px', right: '10px' }} onClick={() => setShowSidebar(true)}>
            <FontAwesomeIcon icon={faGear} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      {mergedExtensions.prePlot}

      {traceStatus === 'success' && layout && traces?.plots.length > 0 ? (
        <PlotlyComponent
          divId={`plotlyDiv${id}`}
          data={[...traces.plots.map((p) => p.data), ...traces.legendPlots.map((p) => p.data)]}
          layout={layout}
          config={{ responsive: true, displayModeBar: false }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          // plotly redraws everything on updates, so you need to reappend title and
          onUpdate={() => {
            for (const p of traces.plots) {
              d3v7.select(`g .${p.data.xaxis}title`).style('pointer-events', 'all').append('title').text(p.xLabel);

              d3v7.select(`g .${p.data.yaxis}title`).style('pointer-events', 'all').append('title').text(p.yLabel);
            }
          }}
        />
      ) : traceStatus !== 'pending' ? (
        <InvalidCols headerMessage={traces?.errorMessageHeader} bodyMessage={traceError?.message || traces?.errorMessage} />
      ) : null}
      {mergedExtensions.postPlot}
      {showSidebar ? (
        <VisSidebarWrapper id={id} target={plotlyDivRef.current} open={showSidebar} onClose={() => setShowSidebar(false)}>
          <ViolinVisSidebar config={config} optionsConfig={optionsConfig} extensions={extensions} columns={columns} setConfig={setConfig} />
        </VisSidebarWrapper>
      ) : null}
    </Container>
  );
}
