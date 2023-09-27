import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Input, NumberInput, SegmentedControl, Text, Tooltip } from '@mantine/core';
import * as d3 from 'd3v7';
import * as React from 'react';
import { ColumnInfo, EScaleType, ICommonVisSideBarProps, VisColumn } from '../interfaces';
import { NumericalColumnSelect } from '../sidebar/NumericalColumnSelect';
import { ECorrelationType, ICorrelationConfig } from './interfaces';

export function CorrelationVisSidebar({
  config,
  columns,
  setConfig,
  style: { width = '20em', ...style } = {},
}: {
  config: ICorrelationConfig;

  columns: VisColumn[];
  setConfig: (config: ICorrelationConfig) => void;
} & ICommonVisSideBarProps<ICorrelationConfig>) {
  return (
    <>
      <NumericalColumnSelect
        callback={(numColumnsSelected: ColumnInfo[]) => setConfig({ ...config, numColumnsSelected })}
        columns={columns}
        currentSelected={config.numColumnsSelected || []}
      />

      <Input.Wrapper label="Correlation type">
        <SegmentedControl
          fullWidth
          size="xs"
          data={Object.values(ECorrelationType)}
          value={config.correlationType}
          onChange={(v) => setConfig({ ...config, correlationType: v as ECorrelationType })}
        />
      </Input.Wrapper>

      <Input.Wrapper label="P-value scale type">
        <SegmentedControl
          fullWidth
          size="xs"
          data={Object.values(EScaleType)}
          value={config.pScaleType}
          onChange={(v) => setConfig({ ...config, pScaleType: v as EScaleType })}
        />
      </Input.Wrapper>
      <NumberInput
        styles={{ input: { width: '100%' }, label: { width: '100%' } }}
        precision={20}
        min={0}
        max={1}
        step={0.05}
        formatter={(value) => {
          return d3.format('.3~g')(+value);
        }}
        onChange={(val) => setConfig({ ...config, pDomain: [+val, config.pDomain[1]] })}
        label={
          <Group style={{ width: '100%' }} position="apart">
            <Text>Maximum p-value</Text>
            <Tooltip
              withinPortal
              withArrow
              arrowSize={6}
              label={
                <Group>
                  <Text>Sets the maximum p-value for the size scale. Any p-value at or above this value will have the smallest possible circle</Text>
                </Group>
              }
            >
              <ActionIcon>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </ActionIcon>
            </Tooltip>
          </Group>
        }
        value={config.pDomain[0]}
      />
      <NumberInput
        styles={{ input: { width: '100%' }, label: { width: '100%' } }}
        precision={20}
        min={0}
        max={1}
        step={0.05}
        formatter={(value) => {
          return d3.format('.3~g')(+value);
        }}
        onChange={(val) => setConfig({ ...config, pDomain: [config.pDomain[0], +val] })}
        label={
          <Group style={{ width: '100%' }} position="apart">
            <Text>Minimum p-value</Text>
            <Tooltip
              withinPortal
              withArrow
              arrowSize={6}
              label={
                <Group>
                  <Text>Sets the minimum p-value for the size scale. Any p-value at or below this value will have the largest possible circle</Text>
                </Group>
              }
            >
              <ActionIcon>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </ActionIcon>
            </Tooltip>
          </Group>
        }
        value={config.pDomain[1]}
      />
    </>
  );
}
