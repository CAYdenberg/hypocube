import React from 'react';

import { PxLine } from '../primitives/Line';
import {
  ChartEventHandlers,
  ChartEventMetaData,
  ChartStyleT,
  Point,
} from '../../types';
import useChartState from '../base/ChartState';
import Handle from '../primitives/Handle';

export interface DataboxVerticalProps {
  x: number;
  yMin: number;
  yMax: number;
  chartStyle: ChartStyleT;
  handlerMeta?: ChartEventMetaData;
}

export const DataboxVertical: React.FC<DataboxVerticalProps &
  ChartEventHandlers> = (props) => {
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
    <Handle
      {...props}
      meta={props.handlerMeta}
      elementPosition={[props.x, props.yMax]}
    >
      <PxLine
        path={path}
        fill={dataBoxFill}
        stroke={dataBoxStroke}
        strokeWidth={dataBoxStrokeWidth}
      />
    </Handle>
  );
};
