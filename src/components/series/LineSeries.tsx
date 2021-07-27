import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { DataPoint, DataPointProps } from '../data/DataPoint';
import { Line } from '../primitives/Line';
import { useChartStyle } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';
import useChartState from '../base/ChartState';
import { createViewbox, ViewboxDuck } from '../../lib/Viewbox';

interface DataLineProps {
  data: Point[];
  chartStyle?: ChartStyleOptions;
}

export const DataLine: React.FC<DataLineProps> = (props) => {
  const { data } = props;

  const {
    dataLineStroke,
    dataLineStrokeWidth,
    dataLineCurveType,
    dataLineDashType,
  } = useChartStyle(props.chartStyle);

  // filter out points that are out of range and both their neighbours are
  // out of range.

  return (
    <Line
      path={data}
      stroke={dataLineStroke}
      strokeWidth={dataLineStrokeWidth}
      curveType={dataLineCurveType}
      dash={dataLineDashType}
    />
  );
};

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
              x >= view.x[0] &&
              x <= view.x[1] &&
              y >= view.y[0] &&
              y <= view.y[1]
          );

    return (
      <React.Fragment>
        <DataLine {...props} />
        {filteredPoints.map(([x, y]) => (
          <DataPoint
            x={x}
            y={y}
            key={`${x},${y}`}
            {...props}
            chartStyle={chartStyle}
          />
        ))}
      </React.Fragment>
    );
  };

  return LineSeries;
};

export const LineSeries = LineSeriesComposer();
