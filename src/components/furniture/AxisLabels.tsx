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
    axisTickLabelOffset,
    axisTickLength,
    axisLabelOffset,
  } = useChartStyle(chartStyle);

  const labelAbsoluteOffset =
    axisTickLength + axisTickLabelOffset + fontSize + axisLabelOffset;

  return (
    <Text
      position={position}
      pxOffset={[0, labelAbsoluteOffset]}
      text={label}
      color={axisColor}
      align="center"
      fontSize={fontSize}
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
    axisTickLabelOffset,
    axisTickLength,
    axisLabelOffset,
  } = useChartStyle(chartStyle);

  const labelAbsoluteOffset =
    axisTickLength + axisTickLabelOffset + axisLabelOffset;

  return (
    <Text
      position={position}
      pxOffset={[0, labelAbsoluteOffset]}
      text={label}
      color={axisColor}
      align="right"
      fontSize={fontSize}
      rotation={1.5 * Math.PI}
    />
  );
};
