import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import merge from 'lodash/merge';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionIcon, Center, Container, Group, SimpleGrid, Stack, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { VisColumn, IVisConfig, IHexbinConfig, EScatterSelectSettings } from '../interfaces';
import { InvalidCols } from '../general';
import { i18n } from '../../i18n';
import { Hexplot } from './Hexplot';
import { HexbinVisSidebar } from './HexbinVisSidebar';
import { VisSidebarWrapper } from '../VisSidebarWrapper';
import { BrushOptionButtons } from '../sidebar';
import { useSyncedRef } from '../../hooks/useSyncedRef';
import { VisSidebarOpenButton } from '../VisSidebarOpenButton';

const defaultExtensions = {
  prePlot: null,
  postPlot: null,
  preSidebar: null,
  postSidebar: null,
};

export function HexbinVis({
  config,
  extensions,
  columns,
  setConfig,
  selectionCallback = () => null,
  selected = {},
  enableSidebar,
  setShowSidebar,
  showSidebar,
  showDragModeOptions = true,
}: {
  config: IHexbinConfig;
  extensions?: {
    prePlot?: React.ReactNode;
    postPlot?: React.ReactNode;
    preSidebar?: React.ReactNode;
    postSidebar?: React.ReactNode;
  };
  columns: VisColumn[];
  setConfig: (config: IVisConfig) => void;
  selectionCallback?: (ids: string[]) => void;
  selected?: { [key: string]: boolean };
  showSidebar?: boolean;
  setShowSidebar?(show: boolean): void;
  showDragModeOptions?: boolean;
  enableSidebar?: boolean;
}) {
  const mergedExtensions = useMemo(() => {
    return merge({}, defaultExtensions, extensions);
  }, [extensions]);

  const ref = useRef();

  return (
    <Group noWrap pl={0} pr={0} sx={{ flexGrow: 1, height: '100%', overflow: 'hidden', width: '100%', position: 'relative' }} ref={ref}>
      {enableSidebar ? <VisSidebarOpenButton onClick={() => setShowSidebar(!showSidebar)} isOpen={showSidebar} /> : null}

      <Stack spacing={0} sx={{ height: '100%', width: '100%' }}>
        {showDragModeOptions ? (
          <Center>
            <Group mt="lg">
              <BrushOptionButtons
                callback={(dragMode: EScatterSelectSettings) => setConfig({ ...config, dragMode })}
                options={[EScatterSelectSettings.RECTANGLE, EScatterSelectSettings.PAN]}
                dragMode={config.dragMode}
              />
            </Group>
          </Center>
        ) : null}
        <SimpleGrid style={{ height: '100%' }} cols={config.numColumnsSelected.length > 2 ? config.numColumnsSelected.length : 1}>
          {config.numColumnsSelected.length < 2 ? (
            <InvalidCols headerMessage={i18n.t('visyn:vis.errorHeader')} bodyMessage={i18n.t('visyn:vis.hexbinError')} />
          ) : (
            <>
              {config.numColumnsSelected.length > 2 ? (
                config.numColumnsSelected.map((xCol) => {
                  return config.numColumnsSelected.map((yCol) => {
                    if (xCol.id !== yCol.id) {
                      return (
                        <Hexplot
                          key={yCol.id + xCol.id}
                          selectionCallback={selectionCallback}
                          selected={selected}
                          config={config}
                          columns={[
                            columns.find((col) => col.info.id === yCol.id),
                            columns.find((col) => col.info.id === xCol.id),
                            columns.find((col) => col.info.id === config.color?.id),
                          ]}
                        />
                      );
                    }

                    return <div key={`${xCol.id}hist`} />;
                  });
                })
              ) : (
                <Hexplot
                  selectionCallback={selectionCallback}
                  selected={selected}
                  config={config}
                  columns={[
                    columns.find((col) => col.info.id === config.numColumnsSelected[0].id),
                    columns.find((col) => col.info.id === config.numColumnsSelected[1].id),
                    columns.find((col) => col.info.id === config.color?.id),
                  ]}
                />
              )}
              {mergedExtensions.postPlot}
            </>
          )}
        </SimpleGrid>
      </Stack>
      {showSidebar ? (
        <VisSidebarWrapper>
          <HexbinVisSidebar config={config} extensions={extensions} columns={columns} setConfig={setConfig} />
        </VisSidebarWrapper>
      ) : null}
    </Group>
  );
}
