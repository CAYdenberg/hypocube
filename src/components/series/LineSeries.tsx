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

interface LineSeriesProps {
  data: Point[];
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  renderLine?: React.FC<DataLineProps>;
  renderPoint?: React.FC<DataPointProps>;
}

export const LineSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
  props
) => {
  const { pxBox, isCanvas } = useChartState();
  const chartStyle = useChartStyle(props.chartStyle);

  const Line = props.renderLine || DataLine;
  const Point = props.renderPoint || DataPoint;

  const filteredPoints =
    isCanvas && chartStyle.dataPointSymbol === 'none'
      ? // No interaction, no render: don't bother
        []
      : filterToView(props.data, pxBox);

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
