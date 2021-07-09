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
    dataBoxXOffset: xOffset,
  } = useChartStyle(props.chartStyle);

  const tHalf = dataBoxThickness / 2;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const x = scaleX(props.x);

  const path: Point[] = [
    [x - tHalf + xOffset, yMax],
    [x + tHalf + xOffset, yMax],
    [x + tHalf + xOffset, yMin],
    [x - tHalf + xOffset, yMin],
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
