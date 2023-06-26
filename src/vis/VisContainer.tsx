import * as React from 'react';
import * as d3v7 from 'd3v7';
import { useMemo, useEffect } from 'react';
import { useResizeObserver, useUncontrolled } from '@mantine/hooks';
import { Group, Stack } from '@mantine/core';
import {
  ESupportedPlotlyVis,
  IVisConfig,
  Scales,
  ENumericalColorScaleType,
  EColumnTypes,
  EBarDirection,
  EBarDisplayType,
  EBarGroupingType,
  EScatterSelectSettings,
  EAggregateTypes,
  ICommonVisProps,
} from './interfaces';
import { getCssValue } from '../utils';
import { useSyncedRef } from '../hooks/useSyncedRef';
import { getVisByConfig } from './provider/Provider';
import { VisSidebarWrapper } from './VisSidebarWrapper';

import { VisSidebarOpenButton } from './VisSidebarOpenButton';
import { VisSidebar } from './VisSidebar';
import { registerAllVis } from './provider/utils';

const DEFAULT_SHAPES = ['circle', 'square', 'triangle-up', 'star'];

registerAllVis();

export function EagerVis({
  columns,
  selectedList = [],
  colors = null,
  shapes = DEFAULT_SHAPES,
  selectionCallback = () => null,
  filterCallback = () => null,
  setExternalConfig = () => null,
  closeButtonCallback = () => null,
  showCloseButton = false,
  externalConfig = null,
  enableSidebar = true,
  showSidebar: internalShowSidebar,
  showDragModeOptions = true,
  setShowSidebar: internalSetShowSidebar,
  showSidebarDefault = false,
  scrollZoom = true,
  optionsConfig,
}: Omit<ICommonVisProps<IVisConfig>, 'dimensions'>) {
  const [showSidebar, setShowSidebar] = useUncontrolled<boolean>({
    value: internalShowSidebar,
    defaultValue: showSidebarDefault,
    finalValue: false,
    onChange: internalSetShowSidebar,
  });

  const [ref, dimensions] = useResizeObserver();

  // Each time you switch between vis config types, there is one render where the config is inconsistent with the type before the merge functions in the useEffect below can be called.
  // To ensure that we never render an incosistent config, keep a consistent and a current in the config. Always render the consistent.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [{ consistent: visConfig, current: inconsistentVisConfig }, _setVisConfig] = React.useState<{
    consistent: IVisConfig;
    current: IVisConfig;
  }>(
    externalConfig
      ? { consistent: null, current: externalConfig }
      : columns.filter((c) => c.type === EColumnTypes.NUMERICAL).length > 1
      ? {
          consistent: null,
          current: {
            type: ESupportedPlotlyVis.SCATTER,
            numColumnsSelected: [],
            color: null,
            numColorScaleType: ENumericalColorScaleType.SEQUENTIAL,
            shape: null,
            dragMode: EScatterSelectSettings.RECTANGLE,
            alphaSliderVal: 0.5,
          },
        }
      : {
          consistent: null,
          current: {
            type: ESupportedPlotlyVis.BAR,
            multiples: null,
            group: null,
            direction: EBarDirection.HORIZONTAL,
            display: EBarDisplayType.ABSOLUTE,
            groupType: EBarGroupingType.STACK,
            numColumnsSelected: [],
            catColumnSelected: null,
            aggregateColumn: null,
            aggregateType: EAggregateTypes.COUNT,
          },
        },
  );

  const setExternalConfigRef = useSyncedRef(setExternalConfig);
  useEffect(() => {
    setExternalConfigRef.current?.(visConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(visConfig), setExternalConfigRef]);

  const setVisConfig = React.useCallback((newConfig: IVisConfig) => {
    _setVisConfig((oldConfig) => {
      return {
        current: newConfig,
        consistent: oldConfig.current.type !== newConfig.type ? oldConfig.consistent : newConfig,
      };
    });
  }, []);

  React.useEffect(() => {
    const mergeConfig = getVisByConfig(inconsistentVisConfig)?.mergeConfig;
    if (mergeConfig) {
      const newConfig = mergeConfig(columns, inconsistentVisConfig);
      _setVisConfig({ current: newConfig, consistent: newConfig });
    }
    // DANGER:: this useEffect should only occur when the visConfig.type changes. adding visconfig into the dep array will cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inconsistentVisConfig.type]);

  useEffect(() => {
    if (externalConfig) {
      setVisConfig(externalConfig);
    }
  }, [externalConfig, setVisConfig]);

  // Converting the selected list into a map, since searching through the list to find an item is common in the vis components.
  const selectedMap: { [key: string]: boolean } = useMemo(() => {
    const currMap: { [key: string]: boolean } = {};

    selectedList.forEach((s) => {
      currMap[s] = true;
    });

    return currMap;
  }, [selectedList]);

  const scales: Scales = useMemo(() => {
    const colorScale = d3v7
      .scaleOrdinal()
      .range(
        colors || [
          getCssValue('visyn-c1'),
          getCssValue('visyn-c2'),
          getCssValue('visyn-c3'),
          getCssValue('visyn-c4'),
          getCssValue('visyn-c5'),
          getCssValue('visyn-c6'),
          getCssValue('visyn-c7'),
          getCssValue('visyn-c8'),
          getCssValue('visyn-c9'),
          getCssValue('visyn-c10'),
        ],
      );

    return {
      color: colorScale,
    };
  }, [colors]);

  if (!visConfig) {
    return <div className="tdp-busy" />;
  }

  const commonProps = {
    showSidebar,
    setShowSidebar,
    enableSidebar,
  };

  const Renderer = getVisByConfig(visConfig)?.renderer;

  return (
    <Group
      noWrap
      pl={0}
      pr={0}
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
    >
      {enableSidebar ? <VisSidebarOpenButton onClick={() => setShowSidebar(!showSidebar)} isOpen={showSidebar} /> : null}

      <Stack spacing={0} sx={{ height: '100%', width: '100%' }}>
        {Renderer ? (
          <Renderer
            externalConfig={visConfig}
            dimensions={dimensions}
            optionsConfig={{
              color: {
                enable: true,
              },
            }}
            showDragModeOptions={showDragModeOptions}
            shapes={shapes}
            setExternalConfig={setVisConfig}
            filterCallback={filterCallback}
            selectionCallback={selectionCallback}
            selectedMap={selectedMap}
            selectedList={selectedList}
            columns={columns}
            scales={scales}
            showSidebar={showSidebar}
            showCloseButton={showCloseButton}
            closeButtonCallback={closeButtonCallback}
            scrollZoom={scrollZoom}
            {...commonProps}
          />
        ) : null}
      </Stack>
      {showSidebar ? (
        <VisSidebarWrapper>
          <VisSidebar optionsConfig={optionsConfig} config={visConfig} columns={columns} filterCallback={filterCallback} setConfig={setVisConfig} />
        </VisSidebarWrapper>
      ) : null}
    </Group>
  );
}
