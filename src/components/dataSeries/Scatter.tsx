import React from 'react';
import { ChartStyleOptions, Point, Viewbox } from '../../types';
import { Symbol, symbolType } from '../primitives/Symbol';
import { useChartStyles } from '../base/ChartStyle';
import { normalize } from '../../lib/normalize';
import useChartState from '../base/ChartState';

interface DataPointProps {
  x: number;
  y: number;
  symbol?: symbolType;
  color?: string;
  empty?: boolean;
  overrideStyles?: ChartStyleOptions;
}

export const DataPoint: React.FC<DataPointProps> = (props) => {
  const { x, y } = props;

  const {
    dataFill,
    dataStroke,
    dataStrokeWidth,
    dataPointSize,
    dataPointSymbol,
  } = useChartStyles(props.overrideStyles);

  const stroke = normalize(props.color, dataStroke);
  const fill = props.empty ? null : normalize(props.color, dataFill);
  const symbol = normalize(props.symbol, dataPointSymbol);

  return (
    <Symbol
      point={[x, y]}
      symbol={symbol}
      size={dataPointSize}
      stroke={stroke}
      strokeWidth={dataStrokeWidth}
      fill={fill}
    />
  );
};

interface ScatterSeriesComponents {
  DataPoint?: React.FC<DataPointProps>;
}

const ScatterSeriesDefaultComponents = {
  DataPoint,
};

interface ScatterSeriesProps {
  data: Point[];
  view?: Viewbox;
  color: string;
  symbol?: symbolType;
  empty?: boolean;
  overrideStyles?: ChartStyleOptions;
}

export const ScatterSeriesComposer = (
  Components: ScatterSeriesComponents = {}
) => {
  const { DataPoint } = {
    ...ScatterSeriesDefaultComponents,
    ...Components,
  };

  const ScatterSeries: React.FC<ScatterSeriesProps> = (props) => {
    const { cartesianBox } = useChartState();
    const view = normalize(props.view, cartesianBox);

    return (
      <React.Fragment>
        {props.data.map(([x, y]) =>
          x >= view.x[0] &&
          x <= view.x[1] &&
          y >= view.y[0] &&
          y <= view.y[1] ? (
            <DataPoint x={x} y={y} key={`${x}${y}`} {...props} />
          ) : null
        )}
      </React.Fragment>
    );
  };

  return ScatterSeries;
};

export const ScatterSeries = ScatterSeriesComposer();
