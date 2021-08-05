import React from 'react';
import { TranslatedLine } from '../primitives/Line';
import { ChartStyleT } from '../../types';
import { useChartStyle } from '../base/ChartStyle';

export interface DataAnchorProps {
  x: number;
  y: number;
  chartStyle: ChartStyleT;
}

export const DataAnchorLine: React.FC<DataAnchorProps> = (props) => {
  const {
    dataBoxThickness,
    dataBoxStroke,
    dataBoxStrokeWidth,
    dataBoxFill,
  } = useChartStyle(props.chartStyle);

  return (
    <TranslatedLine
      position={[props.x, props.y]}
      path={[
        [dataBoxThickness / -2, 0],
        [dataBoxThickness / 2, 0],
      ]}
      strokeWidth={dataBoxStrokeWidth}
      stroke={dataBoxStroke}
      fill={dataBoxFill}
    />
  );
};
