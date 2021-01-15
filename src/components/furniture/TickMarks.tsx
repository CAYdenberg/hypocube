import React from 'react';
import { normalize } from '../../lib/normalize';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyles } from '../base/ChartStyle';
import { TranslatedLine } from '../primitives/Line';
import Text from '../primitives/Text';

interface Props {
  position: Point;
  label?: string;
  overrideStyles?: ChartStyleOptions;
}

export const XTickMarkComposer = () => {
  const XTickMark: React.FC<Props> = (props) => {
    const position = props.position;
    const label = normalize(props.label, '');

    const {
      axisColor,
      axisThickness,
      axisTickLength,
      axisTickOffset,
      axisTickLabelOffset,
    } = useChartStyles(props.overrideStyles);

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
          pxOffset={[0, axisTickLabelOffset]}
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
