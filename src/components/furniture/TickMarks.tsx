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

export const XTickMarkComposer = () => {
  const XTickMark: React.FC<TickMarkProps> = (props) => {
    const position = props.position;
    const label = normalize(props.label, '');

    const {
      baseFontSize,
      axisColor,
      axisThickness,
      axisTickLength,
      axisTickOffset,
      axisTickLabelOffset,
    } = useChartStyle(props.chartStyle);

    const labelAbsoluteOffset =
      axisTickLength + axisTickLabelOffset + baseFontSize;

    return (
      <React.Fragment>
        <TranslatedLine
          position={position}
          path={[
            [0, axisTickOffset],
            [0, axisTickOffset + axisTickLength],
          ]}
          strokeWidth={axisThickness}
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

  return XTickMark;
};

export const XTickMark = XTickMarkComposer();

export const YTickMarkComposer = () => {
  const YTickMark: React.FC<TickMarkProps> = (props) => {
    const position = props.position;
    const label = normalize(props.label, '');

    const {
      axisColor,
      axisThickness,
      axisTickLength,
      axisTickOffset,
      axisTickLabelOffset,
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
          strokeWidth={axisThickness}
          stroke={axisColor}
        />
        <Text
          position={position}
          pxOffset={[labelAbsoluteOffset, 0]}
          text={label}
          color={axisColor}
          align="right"
        />
      </React.Fragment>
    );
  };

  return YTickMark;
};

export const YTickMark = YTickMarkComposer();
