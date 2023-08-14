import { Container, Divider, Stack } from '@mantine/core';
import merge from 'lodash/merge';
import * as React from 'react';
import { useMemo } from 'react';
import { ColumnInfo, ESupportedPlotlyVis, ICommonVisSideBarProps } from '../interfaces';
import { CategoricalColumnSelect } from '../sidebar/CategoricalColumnSelect';
import { FilterButtons } from '../sidebar/FilterButtons';
import { NumericalColumnSelect } from '../sidebar/NumericalColumnSelect';
import { ViolinOverlayButtons } from '../sidebar/ViolinOverlayButtons';
import { VisTypeSelect } from '../sidebar/VisTypeSelect';
import { EViolinOverlay, IViolinConfig } from './utils';

const defaultConfig = {
  overlay: {
    enable: true,
    customComponent: null,
  },
  filter: {
    enable: true,
    customComponent: null,
  },
};

export function ViolinVisSidebar({
  config,
  optionsConfig,
  columns,
  setConfig,
  className = '',
  style: { width = '20em', ...style } = {},
  filterCallback,
}: ICommonVisSideBarProps<IViolinConfig>) {
  const mergedOptionsConfig = useMemo(() => {
    return merge({}, defaultConfig, optionsConfig);
  }, [optionsConfig]);

  return (
    <Container fluid p={10}>
      <VisTypeSelect callback={(type: ESupportedPlotlyVis) => setConfig({ ...(config as any), type })} currentSelected={config.type} />
      <Divider my="sm" />
      <Stack spacing="sm">
        <NumericalColumnSelect
          callback={(numColumnsSelected: ColumnInfo[]) => setConfig({ ...config, numColumnsSelected })}
          columns={columns}
          currentSelected={config.numColumnsSelected || []}
        />
        <CategoricalColumnSelect
          callback={(catColumnsSelected: ColumnInfo[]) => setConfig({ ...config, catColumnsSelected })}
          columns={columns}
          currentSelected={config.catColumnsSelected || []}
        />
      </Stack>
      <Divider my="sm" />

      {mergedOptionsConfig.overlay.enable
        ? mergedOptionsConfig.overlay.customComponent || (
            <ViolinOverlayButtons
              callback={(violinOverlay: EViolinOverlay) => setConfig({ ...config, violinOverlay })}
              currentSelected={config.violinOverlay}
            />
          )
        : null}

      {mergedOptionsConfig.filter.enable ? mergedOptionsConfig.filter.customComponent || <FilterButtons callback={filterCallback} /> : null}
    </Container>
  );
}
