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
