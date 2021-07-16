import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { Symbol } from '../primitives/Symbol';
import { Line } from '../primitives/Line';
import { useChartStyle } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';
import useChartState from '../base/ChartState';
import { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import Handle from '../primitives/Handle';

interface DataPointProps {
  x: number;
  y: number;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
}

export const DataPoint: React.FC<DataPointProps & ChartEventHandlers> = (
  props
) => {
  const { x, y } = props;

  const {
    dataPointFill,
    dataPointStroke,
    dataPointStrokeWidth,
    dataPointSize,
    dataPointSymbol,
    dataPointMinTargetRadius,
  } = useChartStyle(props.chartStyle);

  return (
    <Handle {...props} elementPosition={[x, y]} meta={props.handlerMeta}>
      <Symbol
        point={[x, y]}
        symbol={dataPointSymbol}
        size={dataPointSize}
        stroke={dataPointStroke}
        strokeWidth={dataPointStrokeWidth}
        fill={dataPointFill}
        quietRenderRadius={dataPointMinTargetRadius}
      />
    </Handle>
  );
};

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
    const { dataPointSymbol } = useChartStyle(props.chartStyle);
    const view = createViewbox(normalize(props.view, cartesianBox));

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
          <DataPoint x={x} y={y} key={`${x},${y}`} {...props} />
        ))}
      </React.Fragment>
    );
  };

  return LineSeries;
};

export const LineSeries = LineSeriesComposer();
