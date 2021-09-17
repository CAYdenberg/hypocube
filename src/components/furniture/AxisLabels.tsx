import React from 'react';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import Text from '../primitives/Text';

export interface AxisLabelProps {
  position: Point;
  label: string;
  chartStyle?: ChartStyleOptions;
}

export const XAxisLabel: React.FC<AxisLabelProps> = ({
  label,
  chartStyle,
  position,
}) => {
  const {
    fontSize,
    axisColor,
    xAxisLabelPosition,
    svgPointerEvents,
  } = useChartStyle(chartStyle);

  return (
    <Text
      position={position}
      pxOffset={[0, xAxisLabelPosition]}
      text={label}
      color={axisColor}
      align="center"
      fontSize={fontSize}
      svgPointerEvents={svgPointerEvents}
    />
  );
};

export const YAxisLabel: React.FC<AxisLabelProps> = ({
  label,
  chartStyle,
  position,
}) => {
  const {
    fontSize,
    axisColor,
    yAxisLabelPosition,
    svgPointerEvents,
  } = useChartStyle(chartStyle);

  return (
    <Text
      position={position}
      pxOffset={[yAxisLabelPosition + fontSize, 0]}
      text={label}
      color={axisColor}
      align="center"
      fontSize={fontSize}
      rotation={yAxisLabelPosition < 0 ? 1.5 * Math.PI : 0.5 * Math.PI}
      svgPointerEvents={svgPointerEvents}
    />
  );
};
