import React from 'react';

import { PxLine } from '../primitives/Line';
import { ChartStyleOptions, Point } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';

interface DataboxVerticalProps {
  yMin: number;
  yMax: number;
  x: number;
  chartStyle?: ChartStyleOptions;
}

export const DataboxVertical: React.FC<DataboxVerticalProps> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataBoxThickness,
    dataBoxFill,
    dataBoxStroke,
    dataBoxStrokeWidth,
    dataBoxLeftOffset: offset,
  } = useChartStyle(props.chartStyle);

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
