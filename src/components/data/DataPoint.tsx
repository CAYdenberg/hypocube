import React from 'react';
import { Pure } from '../../lib/HypocubePureComponent';
import selectHandlers from '../../lib/selectHandlers';
import {
  ChartEventHandlers,
  ChartEventMetaData,
  ChartStyleT,
} from '../../types';
import Handle from '../primitives/Handle';
import { Symbol } from '../primitives/Symbol';

export interface DataPointProps {
  x: number;
  y: number;
  chartStyle: ChartStyleT;
  handlerMeta?: ChartEventMetaData;
}

export const DataPoint = Pure<DataPointProps & ChartEventHandlers>((props) => {
  const { x, y } = props;

  return (
    <Handle
      {...selectHandlers(props)}
      elementPosition={[x, y]}
      meta={props.handlerMeta}
    >
      <Symbol
        point={[x, y]}
        symbol={props.chartStyle.dataPointSymbol}
        size={props.chartStyle.dataPointSize}
        stroke={props.chartStyle.dataPointStroke}
        strokeWidth={props.chartStyle.dataPointStrokeWidth}
        fill={props.chartStyle.dataPointFill}
        quietRenderRadius={props.chartStyle.dataPointMinTargetRadius}
      />
    </Handle>
  );
});
