import React from 'react';
import { Pure } from '../../lib/HypocubePureComponent';
import { ChartStyleT } from '../../types';
import { Symbol } from '../primitives/Symbol';

export interface DataPointProps {
  x: number;
  y: number;
  chartStyle: ChartStyleT;
}

export const DataPoint = Pure<DataPointProps>((props) => {
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
