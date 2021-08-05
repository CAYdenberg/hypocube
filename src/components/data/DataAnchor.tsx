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
    dataRangeAnchorLength,
    dataRangeAnchorStroke,
    dataRangeAnchorStrokeWidth,
  } = useChartStyle(props.chartStyle);

  return (
    <TranslatedLine
      position={[props.x, props.y]}
      path={[
        [dataRangeAnchorLength / -2, 0],
        [dataRangeAnchorLength / 2, 0],
      ]}
      strokeWidth={dataRangeAnchorStrokeWidth}
      stroke={dataRangeAnchorStroke}
    />
  );
};
