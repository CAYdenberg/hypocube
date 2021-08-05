import React from 'react';
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
import { DataAnchorLine, DataAnchorProps } from '../data/DataAnchor';
import Handle from '../primitives/Handle';

interface RangeVerticalSeriesComponents {
  Anchor?: React.FC<DataAnchorProps>;
}

interface RangeSeriesProps {
  data: Point[];
  view?: Viewbox;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  rangeUp?: number | number[] | number[][];
  rangeDown?: number | number[] | number[][];
}

const RangeVerticalSeriesDefaultComponents = {
  Anchor: DataAnchorLine,
};

export const RangeVerticalSeriesComposer = (
  Components: RangeVerticalSeriesComponents = {}
) => {
  const { Anchor } = {
    ...RangeVerticalSeriesDefaultComponents,
    ...Components,
  };

  const RangeVerticalSeries: React.FC<RangeSeriesProps & ChartEventHandlers> = (
    props
  ) => {
    const { cartesianBox } = useChartState();
    const chartStyle = useChartStyle(props.chartStyle);
    const viewbox = normalize(props.view, cartesianBox);

    return (
      <React.Fragment>
        {props.data.map(([x, y]) =>
          x >= viewbox.xMin || x <= viewbox.xMax ? (
            <Handle
              {...selectHandlers(props)}
              elementPosition={[x, y]}
              meta={props.handlerMeta}
              key={x}
            >
              <Anchor
                {...selectHandlers(props)}
                x={x}
                y={y}
                chartStyle={chartStyle}
              />
            </Handle>
          ) : null
        )}
      </React.Fragment>
    );
  };

  return RangeVerticalSeries;
};

export const TukeySeries = RangeVerticalSeriesComposer();
