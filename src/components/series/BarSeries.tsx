import React from 'react';
import { DataboxVertical } from './Databox';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { normalize } from '../../lib/normalize';
import Viewbox from '../../lib/Viewbox';
import useChartState from '../base/ChartState';
import Handle from '../primitives/Handle';

interface BarProps {
  x: number;
  y: number;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
}

export const BarVertical: React.FC<BarProps & ChartEventHandlers> = (props) => {
  return (
    <Handle
      {...props}
      meta={props.handlerMeta}
      elementPosition={[props.x, props.y]}
    >
      <DataboxVertical {...props} yMin={0} yMax={props.y} x={props.x} />;
    </Handle>
  );
};

interface BarVerticalSeriesComponents {
  BarVertical?: React.FC<BarProps>;
}

interface BarSeriesProps {
  data: Point[];
  view?: Viewbox;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
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

  const BarVerticalSeries: React.FC<BarSeriesProps & ChartEventHandlers> = (
    props
  ) => {
    const { cartesianBox } = useChartState();
    const viewbox = normalize(props.view, cartesianBox);

    return (
      <React.Fragment>
        {props.data.map(([x, y]) =>
          x >= viewbox.x[0] || x <= viewbox.x[1] ? (
            <BarVertical x={x} y={y} key={`${x},${y}`} {...props} />
          ) : null
        )}
      </React.Fragment>
    );
  };

  return BarVerticalSeries;
};

export const BarVerticalSeries = BarVerticalSeriesComposer();
