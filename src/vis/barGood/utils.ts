import { resolveSingleColumn } from '../general/layoutUtils';
import { ColumnInfo, EColumnTypes, VisCategoricalValue, VisColumn, VisNumericalValue } from '../interfaces';

export async function getBarData(
  columns: VisColumn[],
  catColumn: ColumnInfo,
  groupColumn: ColumnInfo | null,
  multiplesColumn: ColumnInfo | null,
): Promise<{
  catColVals: {
    resolvedValues: (VisNumericalValue | VisCategoricalValue)[];
    type: EColumnTypes.NUMERICAL | EColumnTypes.CATEGORICAL;
    info: ColumnInfo;
  };
  groupColVals: {
    resolvedValues: (VisNumericalValue | VisCategoricalValue)[];
    type: EColumnTypes.NUMERICAL | EColumnTypes.CATEGORICAL;
    info: ColumnInfo;
  };
  multiplesColVals: {
    resolvedValues: (VisNumericalValue | VisCategoricalValue)[];
    type: EColumnTypes.NUMERICAL | EColumnTypes.CATEGORICAL;
    info: ColumnInfo;
  };
}> {
  const catColVals = await resolveSingleColumn(columns.find((col) => col.info.id === catColumn.id));

  const groupColVals = await resolveSingleColumn(groupColumn ? columns.find((col) => col.info.id === groupColumn.id) : null);
  const multiplesColVals = await resolveSingleColumn(multiplesColumn ? columns.find((col) => col.info.id === multiplesColumn.id) : null);

  return { catColVals, groupColVals, multiplesColVals };
}
