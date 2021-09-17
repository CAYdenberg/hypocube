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
    />
  );
};

export const DataWhiskerVertical: React.FC<DataRangeVerticalProps> = (
  props
) => {
  const { scaleX, scaleY } = useChartState();
  const {
    dataWhiskerTopCapLength,
    dataWhiskerBottomCapLength,
    dataWhiskerStroke,
    dataWhiskerStrokeWidth,
    seriesXOffset: offset,
    seriesOpacity,
  } = props.chartStyle;

  const yMin = scaleY(props.yMin);
  const yMax = scaleY(props.yMax);
  const midX = scaleX(props.x) + offset;
  const leftXTop = midX - dataWhiskerTopCapLength / 2;
  const leftXBottom = midX - dataWhiskerBottomCapLength / 2;

  return (
    <React.Fragment>
      <PxLine
        path={[
          [leftXTop, yMax],
          [leftXTop + dataWhiskerTopCapLength, yMax],
        ]}
        stroke={dataWhiskerStroke}
        strokeWidth={dataWhiskerStrokeWidth}
        opacity={seriesOpacity}
      />
      <PxLine
        path={[
          [midX, yMin],
          [midX, yMax],
        ]}
        stroke={dataWhiskerStroke}
        strokeWidth={dataWhiskerStrokeWidth}
        opacity={seriesOpacity}
      />
      <PxLine
        path={[
          [leftXBottom, yMin],
          [leftXBottom + dataWhiskerBottomCapLength, yMin],
        ]}
        stroke={dataWhiskerStroke}
        strokeWidth={dataWhiskerStrokeWidth}
        opacity={seriesOpacity}
      />
    </React.Fragment>
  );
};
