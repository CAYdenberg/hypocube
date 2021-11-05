import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import useChartState from '../base/ChartState';
import { DataPoint, DataPointProps } from '../data/DataPoint';
import { DataLine, DataLineProps } from '../data/DataSeriesLine';
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';
import { filterToView } from '../../lib/dataFilters';
import Clip from '../primitives/Clip';
import { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import { normalize } from '../../lib/normalize';

interface LineSeriesProps {
  data: Point[];
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck | null;
  renderLine?: React.FC<DataLineProps>;
  renderPoint?: React.FC<DataPointProps>;
}

export const LineSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
  props
) => {
  const state = useChartState();
  const { isCanvas, cartesianBox } = state;
  const chartStyle = useChartStyle(props.chartStyle);

  const view = normalize(props.view, cartesianBox);
  const clipPath = view ? createViewbox(view).toPath() : null;

  const Line = props.renderLine || DataLine;
  const Point = props.renderPoint || DataPoint;

  const showPoints = !isCanvas || chartStyle.dataPointSymbol !== 'none';

  return (
    <Clip path={clipPath}>
      <Line data={props.data} chartStyle={chartStyle} />

      {showPoints
        ? filterToView(props.data, state).map(([x, y], i) => (
            <Handle
              {...selectHandlers(props)}
              elementPosition={[x, y]}
              meta={props.handlerMeta}
              key={i}
            >
              <Point x={x} y={y} chartStyle={chartStyle} />
            </Handle>
          ))
        : null}
    </Clip>
  );
};
