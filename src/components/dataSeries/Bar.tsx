import React from 'react';
import { DataboxVertical } from './Databox';
import { ChartStyleOptions, Point } from '../../types';
import { normalize } from '../../lib/normalize';
import Viewbox from '../../lib/Viewbox';
import useChartState from '../base/ChartState';

interface BarProps {
  x: number;
  y: number;
  color?: string;
  overrideStyles?: ChartStyleOptions;
}

export const BarVertical: React.FC<BarProps> = (props) => {
  return <DataboxVertical {...props} yMin={0} yMax={props.y} x={props.x} />;
};

interface BarVerticalSeriesComponents {
  BarVertical?: React.FC<BarProps>;
}

interface BarSeriesProps {
  data: Point[];
  view?: Viewbox;
  seriesIndex?: number;
  seriesIndexOutof?: number;
  color: string;
  overrideStyles?: ChartStyleOptions;
}

const BarVerticalSeriesDefaultComponents = {
  BarVertical,
};

export const BarVerticalSeriesComposer = (
  Components: BarVerticalSeriesComponents = {}
) => {
  const { BarVertical } = {
    ...BarVerticalSeriesDefaultComponents,
    ...Components,
  };

  const BarVerticalSeries: React.FC<BarSeriesProps> = (props) => {
    const { cartesianBox } = useChartState();
    const viewbox = normalize(props.view, cartesianBox);

    return (
      <React.Fragment>
        {props.data.map(([x, y]) =>
          x >= viewbox.x[0] || x <= viewbox.x[1] ? (
            <BarVertical x={x} y={y} key={`${x}${y}`} {...props} />
          ) : null
        )}
      </React.Fragment>
    );
  };

  return BarVerticalSeries;
};

export const BarVerticalSeries = BarVerticalSeriesComposer();
