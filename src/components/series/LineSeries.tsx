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
  const state = useChartState();
  const { isCanvas } = state;
  const chartStyle = useChartStyle(props.chartStyle);

  const Line = props.renderLine || DataLine;
  const Point = props.renderPoint || DataPoint;

  const filteredData = filterToView(props.data, state);
  const renderPoints = !isCanvas || chartStyle.dataPointSymbol !== 'none';

  return (
    <React.Fragment>
      <Line data={filteredData} chartStyle={chartStyle} />

      {renderPoints
        ? filteredData.map(([x, y], i) => (
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
    </React.Fragment>
  );
};
