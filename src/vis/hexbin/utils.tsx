import merge from 'lodash/merge';
import {
  EColumnTypes,
  ESupportedPlotlyVis,
  VisColumn,
  IHexbinConfig,
  VisNumericalValue,
  VisCategoricalValue,
  ColumnInfo,
  VisNumericalColumn,
  EHexbinOptions,
  EScatterSelectSettings,
} from '../interfaces';
import { resolveColumnValues, resolveSingleColumn } from '../general/layoutUtils';

export const defaultDensityConfig: IHexbinConfig = {
  type: ESupportedPlotlyVis.HEXBIN,
  numColumnsSelected: [],
  color: null,
  isOpacityScale: true,
  isSizeScale: false,
  hexRadius: 10,
  dragMode: EScatterSelectSettings.PAN,
  hexbinOptions: EHexbinOptions.COLOR,
};

export function hexinbMergeDefaultConfig(columns: VisColumn[], config: IHexbinConfig): IHexbinConfig {
  const merged = merge({}, defaultDensityConfig, config);
  const numCols = columns.filter((c) => c.type === EColumnTypes.NUMERICAL);

  if (merged.numColumnsSelected.length === 0 && numCols.length > 1) {
    merged.numColumnsSelected.push(numCols[numCols.length - 1].info);
    merged.numColumnsSelected.push(numCols[numCols.length - 2].info);
  } else if (merged.numColumnsSelected.length === 1 && numCols.length > 1) {
    if (numCols[numCols.length - 1].info.id !== merged.numColumnsSelected[0].id) {
      merged.numColumnsSelected.push(numCols[numCols.length - 1].info);
    } else {
      merged.numColumnsSelected.push(numCols[numCols.length - 2].info);
    }
  }
  return merged;
}

export async function getHexData(
  columns: VisColumn[],
  numColumnsSelected: ColumnInfo[],
  colorColumn: ColumnInfo | null,
): Promise<{
  numColVals: {
    resolvedValues: (VisNumericalValue | VisCategoricalValue)[];
    type: EColumnTypes.NUMERICAL | EColumnTypes.CATEGORICAL;
    info: ColumnInfo;
  }[];
  colorColVals: {
    resolvedValues: (VisNumericalValue | VisCategoricalValue)[];
    type: EColumnTypes.NUMERICAL | EColumnTypes.CATEGORICAL;
    color?: Record<string, string>;
    info: ColumnInfo;
  };
}> {
  const numCols: VisNumericalColumn[] = [columns[0] as VisNumericalColumn, columns[1] as VisNumericalColumn];

  const numColVals = await resolveColumnValues(numCols);

  const colorColVals = await resolveSingleColumn(colorColumn ? columns.find((col) => col.info.id === colorColumn.id) : null);

  return { numColVals, colorColVals };
}

/**
 * Creates a path for a portion of a single hex in a hexbin plot
 * @param path svg path for the entire hex, generated by d3
 * @param radius radius given to d3 when generating the svg path
 * @param start value between 0-5 reflecting where the cut version of the hex should begin. Rotating clockwise
 * @param sixths value between 0-5 reflecting where the cut version of the hex should end. Rotating clockwise
 * @returns svg path "d" attribute for the portion of the hex.
 */
export function cutHex(path: string, radius: number, start: number, sixths: number): string {
  if (sixths === 6) {
    return path;
  }

  if (sixths === 0 || start > 5) {
    return '';
  }

  const splitPath = path.slice(1, path.length - 1).split(/[l]/);

  const currPos = [0, -radius];

  for (let i = 1; i <= start; i++) {
    currPos[0] += +splitPath[i].split(',')[0];
    currPos[1] += +splitPath[i].split(',')[1];
  }

  let finalString = `m${currPos}`;

  for (let i = 0; i < sixths; i++) {
    finalString += start + 1 + i >= 6 ? '' : `l${splitPath[start + 1 + i]}`;
  }

  if (start + sixths >= 6) {
    finalString += `L 0 -${radius}`;
  }

  finalString += 'L 0 0 z';

  return `${finalString}`;
}
