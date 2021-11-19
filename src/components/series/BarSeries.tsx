import React from 'react';
import { DataBoxVertical, DataRangeVerticalProps } from '../data/DataRange';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { normalize } from '../../lib/normalize';
import { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';
import Clip from '../primitives/Clip';

interface BarSeriesProps {
  data: Point[];
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck | null;
  renderBar?: React.FC<DataRangeVerticalProps>;
}

export const BarVerticalSeries: React.FC<BarSeriesProps &
  ChartEventHandlers> = (props) => {
  const { cartesianBox } = useChartState();
  const chartStyle = useChartStyle(props.chartStyle);

  const view = normalize(props.view, cartesianBox);
  const clipPath = view ? createViewbox(view).toPath() : null;

  const Bar = props.renderBar || DataBoxVertical;

  // TODO: data filtering

  return (
    <Clip path={clipPath}>
      {props.data.map(([x, y]) => (
        <Handle
          {...selectHandlers(props)}
          meta={props.handlerMeta}
          elementPosition={[x, y]}
          key={`${x},${y}`}
        >
          <Bar x={x} yMin={0} yMax={y} chartStyle={chartStyle} />
        </Handle>
      ))}
    </Clip>
  );
};
