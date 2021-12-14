import React from 'react';

import { PxLine } from '../primitives/Line';
import { ChartStyleT, Point } from '../../types';
import useChartState from '../base/ChartState';
export interface DataRangeVerticalProps {
  x: number;
  yMin: number;
  yMax: number;
  chartStyle: ChartStyleT;
}

export const DataBoxVertical: React.FC<DataRangeVerticalProps> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataBoxThickness,
    dataBoxFill,
    dataBoxStroke,
    dataBoxStrokeWidth,
    seriesXOffset: offset,
    seriesOpacity,
    svgPointerEvents,
  } = props.chartStyle;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const leftX = scaleX(props.x) - dataBoxThickness / 2 + offset;

  const path: Point[] = [
    [leftX, yMax],
    [leftX + dataBoxThickness, yMax],
    [leftX + dataBoxThickness, yMin],
    [leftX, yMin],
    [leftX, yMax],
  ];

  return (
    <PxLine
      path={path}
      fill={dataBoxFill}
      stroke={dataBoxStroke}
      strokeWidth={dataBoxStrokeWidth}
      opacity={seriesOpacity}
      svgPointerEvents={svgPointerEvents}
    />
  );
};

export const DataRangeVertical: React.FC<DataRangeVerticalProps> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataRangeStroke,
    dataRangeStrokeWidth,
    seriesXOffset: offset,
    seriesOpacity,
    svgPointerEvents,
  } = props.chartStyle;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const midX = scaleX(props.x) + offset;

  return (
    <PxLine
      path={[
        [midX, yMin],
        [midX, yMax],
      ]}
      stroke={dataRangeStroke}
      strokeWidth={dataRangeStrokeWidth}
      opacity={seriesOpacity}
      svgPointerEvents={svgPointerEvents}
    />
  );
};
