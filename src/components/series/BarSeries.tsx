import React from 'react';
import { DataboxVertical, DataboxVerticalProps } from '../data/Databox';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { normalize } from '../../lib/normalize';
import Viewbox from '../../lib/Viewbox';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';

interface BarVerticalSeriesComponents {
  DataBoxVertical?: React.FC<DataboxVerticalProps>;
}

interface BarSeriesProps {
  data: Point[];
  view?: Viewbox;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
}

const BarVerticalSeriesDefaultComponents = {
  DataboxVertical,
};

export const BarVerticalSeriesComposer = (
  Components: BarVerticalSeriesComponents = {}
) => {
  const { DataboxVertical } = {
    ...BarVerticalSeriesDefaultComponents,
    ...Components,
  };

  const BarVerticalSeries: React.FC<BarSeriesProps & ChartEventHandlers> = (
    props
  ) => {
    const { cartesianBox } = useChartState();
    const chartStyle = useChartStyle(props.chartStyle);
    const viewbox = normalize(props.view, cartesianBox);

    return (
      <React.Fragment>
        {props.data.map(([x, y]) =>
          x >= viewbox.x[0] || x <= viewbox.x[1] ? (
            <DataboxVertical
              {...props}
              x={x}
              yMin={0}
              yMax={y}
              key={`${x},${y}`}
              chartStyle={chartStyle}
            />
          ) : null
        )}
      </React.Fragment>
    );
  };

  return BarVerticalSeries;
};

export const BarVerticalSeries = BarVerticalSeriesComposer();
