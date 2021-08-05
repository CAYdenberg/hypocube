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
import { DataWhiskerVertical, DataRangeVerticalProps } from '../data/DataRange';
import Handle from '../primitives/Handle';

interface RangeSeriesProps {
  data: Array<{
    anchor: Point;
    ranges?: number[];
  }>;
  view?: Viewbox;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  renderAnchor?: React.FC<DataAnchorProps>;
}

export const RangeVerticalSeries: React.FC<RangeSeriesProps &
  ChartEventHandlers> = (props) => {
  const { cartesianBox } = useChartState();
  const chartStyle = useChartStyle(props.chartStyle);
  const viewbox = normalize(props.view, cartesianBox);

  const Anchor = props.renderAnchor || DataAnchorLine;

  return (
    <React.Fragment>
      {props.data.map(({ anchor, ranges }) => {
        const [x, y] = anchor;

        const rangePairs = ranges
          ? ranges
              .slice(0, ranges.length - 1)
              .map((val, i) => [val, ranges[i + 1]])
          : [];

        return x >= viewbox.xMin || x <= viewbox.xMax ? (
          <Handle
            {...selectHandlers(props)}
            elementPosition={[x, y]}
            meta={props.handlerMeta}
            key={x}
          >
            <Anchor x={x} y={y} chartStyle={chartStyle} />
            {rangePairs.map((pair, i) => (
              <DataWhiskerVertical
                x={anchor[0]}
                yMin={pair[0]}
                yMax={pair[1]}
                chartStyle={chartStyle}
                key={i}
              />
            ))}
          </Handle>
        ) : null;
      })}
    </React.Fragment>
  );
};
