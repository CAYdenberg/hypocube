import React from 'react';

import { PxLine } from '../primitives/Line';
import { ChartStyleOptions, Point } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';

interface DataboxVerticalProps {
  yMin: number;
  yMax: number;
  x: number;
  xOffset?: number;
  color?: string;
  styles?: ChartStyleOptions;
}

export const DataboxVertical: React.FC<DataboxVerticalProps> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataBoxThickness,
    dataBoxFill,
    dataBoxStroke,
    dataBoxStrokeWidth,
  } = useChartStyle(props.styles);

  const tHalf = dataBoxThickness / 2;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const x = scaleX(props.x);
  const xOffset = normalize(props.xOffset, 0);
  const fill = props.color || dataBoxFill;

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
      stroke={dataBoxStroke}
      strokeWidth={dataBoxStrokeWidth}
    />
  );
};
