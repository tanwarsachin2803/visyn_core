import * as React from 'react';
import { merge, uniqueId } from 'lodash';
import { useMemo } from 'react';
import { DensityVisSidebar } from './DensityVisSidebar';
// eslint-disable-next-line import/no-cycle
import { HexagonalBin } from './HexagonalBin';
const defaultExtensions = {
    prePlot: null,
    postPlot: null,
    preSidebar: null,
    postSidebar: null,
};
export function DensityVis({ config, extensions, columns, setConfig, selected = {}, hideSidebar = false }) {
    const mergedExtensions = useMemo(() => {
        return merge({}, defaultExtensions, extensions);
    }, [extensions]);
    //   const { value: traces, status: traceStatus, error: traceError } = useAsync(createPCPTraces, [columns, config, selected]);
    const id = React.useMemo(() => uniqueId('PCPVis'), []);
    return (React.createElement("div", { className: "d-flex flex-row w-100 h-100", style: { minHeight: '0px' } },
        React.createElement("div", { className: "position-relative d-grid flex-grow-1", style: { gridTemplateColumns: 'minmax(0, 1fr) '.repeat(config.numColumnsSelected.length < 3 ? 1 : config.numColumnsSelected.length) } },
            config.numColumnsSelected.length > 2 ? (config.numColumnsSelected.map((xCol) => {
                return config.numColumnsSelected.map((yCol) => {
                    if (xCol.id !== yCol.id) {
                        console.log(xCol, yCol);
                        return (React.createElement(HexagonalBin, { config: config, columns: [columns.find((col) => col.info.id === xCol.id), columns.find((col) => col.info.id === yCol.id)] }));
                    }
                    return React.createElement("div", null, "hello world");
                });
            })) : (React.createElement(HexagonalBin, { config: config, columns: columns })),
            mergedExtensions.postPlot),
        !hideSidebar ? (React.createElement("div", { className: "position-relative h-100 flex-shrink-1 bg-light overflow-auto mt-2" },
            React.createElement("button", { className: "btn btn-primary-outline", type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#generalVisBurgerMenu${id}`, "aria-expanded": "true", "aria-controls": "generalVisBurgerMenu" },
                React.createElement("i", { className: "fas fa-bars" })),
            React.createElement("div", { className: "collapse show collapse-horizontal", id: `generalVisBurgerMenu${id}` },
                React.createElement(DensityVisSidebar, { config: config, extensions: extensions, columns: columns, setConfig: setConfig })))) : null));
}
//# sourceMappingURL=DensityVis.js.map