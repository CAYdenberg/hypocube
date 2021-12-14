import React from 'react';
import { Pure } from '../../lib/HypocubePureComponent';
import { ChartStyleT } from '../../types';
import Symbol from '../primitives/Symbol';
import { TranslatedLine } from '../primitives/Line';

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
      opacity={props.chartStyle.seriesOpacity}
      quietRenderRadius={props.chartStyle.dataPointMinTargetRadius}
      svgPointerEvents={props.chartStyle.svgPointerEvents}
    />
  );
});

export const DataRangeCap: React.FC<DataPointProps> = (props) => {
  const {
    dataRangeStroke,
    dataRangeStrokeWidth,
    dataRangeCapLength,
    seriesXOffset: offset,
    seriesOpacity,
  } = props.chartStyle;

  return (
    <TranslatedLine
      position={[props.x, props.y]}
      path={[
        [offset + dataRangeCapLength / -2, 0],
        [offset + dataRangeCapLength / 2, 0],
      ]}
      strokeWidth={dataRangeStrokeWidth}
      stroke={dataRangeStroke}
      opacity={seriesOpacity}
      svgPointerEvents={props.chartStyle.svgPointerEvents}
    />
  );
};
