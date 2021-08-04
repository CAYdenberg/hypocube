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
import { DataLine, DataLineProps } from '../data/DataLine';
import selectHandlers from '../../lib/selectHandlers';

interface LineSeriesComponents {
  DataPoint?: React.FC<DataPointProps>;
  DataLine?: React.FC<DataLineProps>;
}

const LineSeriesDefaultComponents = {
  DataPoint,
  DataLine,
};

interface LineSeriesProps {
  data: Point[];
  view?: ViewboxDuck;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
}

export const LineSeriesComposer = (Components: LineSeriesComponents = {}) => {
  const { DataLine, DataPoint } = {
    ...LineSeriesDefaultComponents,
    ...Components,
  };

  const LineSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
    props
  ) => {
    const { cartesianBox, isCanvas } = useChartState();
    const view = createViewbox(normalize(props.view, cartesianBox));

    const chartStyle = useChartStyle(props.chartStyle);
    const { dataPointSymbol } = chartStyle;

    const filteredPoints =
      isCanvas && dataPointSymbol === 'none'
        ? // No interaction, no render: don't bother
          []
        : props.data.filter(
            ([x, y], i) =>
              x >= view.xMin &&
              x <= view.xMax &&
              y >= view.yMin &&
              y <= view.yMax
          );

    return (
      <React.Fragment>
        <DataLine data={props.data} chartStyle={chartStyle} />

        {filteredPoints.map(([x, y]) => (
          <DataPoint
            {...selectHandlers(props)}
            x={x}
            y={y}
            key={`${x},${y}`}
            chartStyle={chartStyle}
          />
        ))}
      </React.Fragment>
    );
  };

  return LineSeries;
};

export const LineSeries = LineSeriesComposer();
