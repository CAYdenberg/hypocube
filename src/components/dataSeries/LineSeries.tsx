import React from 'react';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyles } from '../base/ChartStyle';
import { dashType, Line } from '../primitives/Line';

interface LineSeriesProps {
  data: Point[];
  color: string;
  dash?: dashType;
  overrideStyles?: ChartStyleOptions;
}

export const LineSeries: React.FC<LineSeriesProps> = props => {
  const { color, data } = props;

  const {
    dataStrokeWidth,
    dataLineCurveType,
    dataLineDashType,
  } = useChartStyles(props.overrideStyles);

  return (
    <Line
      path={data}
      stroke={color}
      strokeWidth={dataStrokeWidth}
      curveType={dataLineCurveType}
      dash={dataLineDashType}
    />
  );
};
