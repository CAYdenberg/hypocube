import React from 'react';
import { DataBoxVertical, DataRangeVerticalProps } from '../data/DataRange';
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
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';

interface BarVerticalSeriesComponents {
  DataBoxVertical?: React.FC<DataRangeVerticalProps>;
}

interface BarSeriesProps {
  data: Point[];
  view?: Viewbox;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
}

const BarVerticalSeriesDefaultComponents = {
  DataBoxVertical,
};

export const BarVerticalSeriesComposer = (
  Components: BarVerticalSeriesComponents = {}
) => {
  const { DataBoxVertical } = {
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
            <Handle
              {...selectHandlers(props)}
              meta={props.handlerMeta}
              elementPosition={[x, y]}
              key={`${x},${y}`}
            >
              <DataBoxVertical
                {...selectHandlers(props)}
                x={x}
                yMin={0}
                yMax={y}
                chartStyle={chartStyle}
              />
            </Handle>
          ) : null
        )}
      </React.Fragment>
    );
  };

  return BarVerticalSeries;
};

export const BarVerticalSeries = BarVerticalSeriesComposer();
