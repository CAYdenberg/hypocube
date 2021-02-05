import React from 'react';
import { DataboxVertical } from './Databox';
import { ChartStyleOptions, Point } from '../../types';

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
    return (
      <React.Fragment>
        {props.data.map(([x, y]) => (
          <BarVertical x={x} y={y} key={`${x}${y}`} {...props} />
        ))}
      </React.Fragment>
    );
  };

  return BarVerticalSeries;
};

export const BarVerticalSeries = BarVerticalSeriesComposer();
