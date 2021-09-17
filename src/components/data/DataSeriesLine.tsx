import React from 'react';
import { Pure } from '../../lib/HypocubePureComponent';
import { ChartStyleT, Point } from '../../types';
import { Line } from '../primitives/Line';

export interface DataLineProps {
  data: Point[];
  chartStyle: ChartStyleT;
}

export const DataLine = Pure<DataLineProps>((props) => {
  const { data, chartStyle } = props;

  const {
    dataLineStroke,
    dataLineStrokeWidth,
    dataLineCurveType,
    dataLineDashType,
    seriesOpacity,
    svgPointerEvents,
  } = chartStyle;

  // filter out points that are out of range and both their neighbours are
  // out of range.

  return (
    <Line
      path={data}
      stroke={dataLineStroke}
      strokeWidth={dataLineStrokeWidth}
      curveType={dataLineCurveType}
      dash={dataLineDashType}
      opacity={seriesOpacity}
      svgPointerEvents={svgPointerEvents}
    />
  );
});
