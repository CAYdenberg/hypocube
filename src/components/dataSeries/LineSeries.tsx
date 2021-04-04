import React from 'react';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyles } from '../base/ChartStyle';
import { dashType, Line } from '../primitives/Line';
import Viewbox from '../../lib/Viewbox';

interface LineSeriesProps {
  data: Point[];
  view?: Viewbox;
  color: string;
  dash?: dashType;
  overrideStyles?: ChartStyleOptions;
}

export const LineSeries: React.FC<LineSeriesProps> = (props) => {
  const { color, data } = props;

  const {
    dataStrokeWidth,
    dataLineCurveType,
    dataLineDashType,
  } = useChartStyles(props.overrideStyles);

  // filter out points that are out of range and both their neighbours are
  // out of range.

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
