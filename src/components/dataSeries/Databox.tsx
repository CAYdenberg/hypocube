import React from 'react';

import { PxLine } from '../primitives/Line';
import { ChartStyleOptions, Point } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyles } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';

interface DataboxVerticalProps {
  yMin: number;
  yMax: number;
  x: number;
  xOffset?: number;
  color?: string;
  overrideStyles?: ChartStyleOptions;
}

export const DataboxVertical: React.FC<DataboxVerticalProps> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataBoxThickness,
    dataFill,
    dataStroke,
    dataStrokeWidth,
  } = useChartStyles(props.overrideStyles);

  const tHalf = dataBoxThickness / 2;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const x = scaleX(props.x);
  const xOffset = normalize(props.xOffset, 0);
  const fill = props.color || dataFill;

  const path: Point[] = [
    [x - tHalf + xOffset, yMax],
    [x + tHalf + xOffset, yMax],
    [x + tHalf + xOffset, yMin],
    [x - tHalf + xOffset, yMin],
  ];

  return (
    <PxLine
      path={path}
      fill={fill}
      stroke={dataStroke}
      strokeWidth={dataStrokeWidth}
    />
  );
};
