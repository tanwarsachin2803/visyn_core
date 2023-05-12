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
  enableSidebar?: boolean;
}) {
  const mergedExtensions = useMemo(() => {
    return merge({}, defaultExtensions, extensions);
  }, [extensions]);

  const [sidebarMounted, setSidebarMounted] = useState<boolean>(false);

  // Cheating to open the sidebar after the first render, since it requires the container to be mounted
  useEffect(() => {
    setSidebarMounted(true);
  }, [setSidebarMounted]);

  const ref = useRef();
  const id = React.useMemo(() => uniqueId('HexbinVis'), []);

  return (
    <Container pl={0} pr={0} fluid sx={{ flexGrow: 1, height: '100%', overflow: 'hidden', width: '100%', position: 'relative' }} ref={ref}>
      {enableSidebar ? (
        <Tooltip withinPortal label={i18n.t('visyn:vis.openSettings')}>
          <ActionIcon sx={{ zIndex: 10, position: 'absolute', top: '10px', right: '10px' }} onClick={() => setShowSidebar(true)}>
            <FontAwesomeIcon icon={faGear} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      <Stack spacing={0} sx={{ height: '100%' }}>
        <Center>
          <Group mt="lg">
            <BrushOptionButtons
              callback={(dragMode: EScatterSelectSettings) => setConfig({ ...config, dragMode })}
              options={[EScatterSelectSettings.RECTANGLE, EScatterSelectSettings.PAN]}
              dragMode={config.dragMode}
            />
          </Group>
        </Center>
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
      {showSidebar && sidebarMounted ? (
        <VisSidebarWrapper id={id} target={ref.current} open={showSidebar} onClose={() => setShowSidebar(false)}>
          <HexbinVisSidebar config={config} extensions={extensions} columns={columns} setConfig={setConfig} />
        </VisSidebarWrapper>
      ) : null}
    </Container>
  );
}
