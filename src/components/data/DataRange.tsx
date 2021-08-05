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
    dataBoxLeftOffset: offset,
  } = props.chartStyle;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const dataX = scaleX(props.x);
  const leftX = dataX + dataBoxThickness * offset;

  const path: Point[] = [
    [leftX, yMax],
    [leftX + dataBoxThickness, yMax],
    [leftX + dataBoxThickness, yMin],
    [leftX, yMin],
  ];

  return (
    <PxLine
      path={path}
      fill={dataBoxFill}
      stroke={dataBoxStroke}
      strokeWidth={dataBoxStrokeWidth}
    />
  );
};
