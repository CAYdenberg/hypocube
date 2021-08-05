import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';
import { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import useChartState from '../base/ChartState';
import { DataPoint, DataPointProps } from '../data/DataPoint';
import { DataLine, DataLineProps } from '../data/DataSeriesLine';
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';

interface LineSeriesProps {
  data: Point[];
  view?: ViewboxDuck;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  renderLine?: React.FC<DataLineProps>;
  renderPoint?: React.FC<DataPointProps>;
}

export const LineSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
  props
) => {
  const { cartesianBox, isCanvas } = useChartState();
  const view = createViewbox(normalize(props.view, cartesianBox));
  const chartStyle = useChartStyle(props.chartStyle);
  const { dataPointSymbol } = chartStyle;

  const Line = props.renderLine || DataLine;
  const Point = props.renderPoint || DataPoint;

  const filteredPoints =
    isCanvas && dataPointSymbol === 'none'
      ? // No interaction, no render: don't bother
        []
      : props.data.filter(
          ([x, y]) =>
            x >= view.xMin && x <= view.xMax && y >= view.yMin && y <= view.yMax
        );

  return (
    <React.Fragment>
      <Line data={props.data} chartStyle={chartStyle} />

      {filteredPoints.map(([x, y], i) => (
        <Handle
          {...selectHandlers(props)}
          elementPosition={[x, y]}
          meta={props.handlerMeta}
          key={i}
        >
          <Point x={x} y={y} chartStyle={chartStyle} />
        </Handle>
      ))}
    </React.Fragment>
  );
};
