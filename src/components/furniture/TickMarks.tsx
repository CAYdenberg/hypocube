import React from 'react';
import { normalize } from '../../lib/normalize';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import { TranslatedLine } from '../primitives/Line';
import Text from '../primitives/Text';

export interface TickMarkProps {
  position: Point;
  label?: string;
  chartStyle?: ChartStyleOptions;
}

export const XTickMark: React.FC<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, '');

  const {
    fontSize,
    axisColor,
    axisStrokeWidth,
    axisTickLength,
    axisTickOffset,
    axisTickLabelOffset,
  } = useChartStyle(props.chartStyle);

  const labelAbsoluteOffset = axisTickLength + axisTickLabelOffset + fontSize;

  return (
    <React.Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0, axisTickOffset],
          [0, axisTickOffset + axisTickLength],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
      />
      <Text
        position={position}
        pxOffset={[0, labelAbsoluteOffset]}
        text={label}
        color={axisColor}
        align="center"
      />
    </React.Fragment>
  );
};

export const YTickMark: React.FC<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, '');

  const {
    axisColor,
    axisStrokeWidth,
    axisTickLength,
    axisTickOffset,
    axisTickLabelOffset,
    fontSize,
  } = useChartStyle(props.chartStyle);

  const labelAbsoluteOffset = 0 - axisTickLength - axisTickLabelOffset;

  return (
    <React.Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0 - axisTickOffset, 0],
          [0 - axisTickLength - axisTickOffset, 0],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
      />
      <Text
        position={position}
        pxOffset={[labelAbsoluteOffset, fontSize / 2 - axisStrokeWidth]}
        text={label}
        color={axisColor}
        align="right"
      />
    </React.Fragment>
  );
};
