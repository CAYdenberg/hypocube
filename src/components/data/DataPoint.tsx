import React from 'react';
import { Pure } from '../../lib/HypocubePureComponent';
import {
  ChartEventHandlers,
  ChartEventMetaData,
  ChartStyleT,
} from '../../types';
import { Symbol } from '../primitives/Symbol';

export interface DataPointProps {
  x: number;
  y: number;
  chartStyle: ChartStyleT;
  handlerMeta?: ChartEventMetaData;
}

export const DataPoint = Pure<DataPointProps & ChartEventHandlers>((props) => {
  const { x, y } = props;

  return (
    <Symbol
      point={[x, y]}
      symbol={props.chartStyle.dataPointSymbol}
      size={props.chartStyle.dataPointSize}
      stroke={props.chartStyle.dataPointStroke}
      strokeWidth={props.chartStyle.dataPointStrokeWidth}
      fill={props.chartStyle.dataPointFill}
      quietRenderRadius={props.chartStyle.dataPointMinTargetRadius}
    />
  );
});
