import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { normalize } from '../../lib/normalize';
import { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import selectHandlers from '../../lib/selectHandlers';
import { DataAnchorLine, DataPointProps } from '../data/DataPoint';
import { DataWhiskerVertical, DataRangeVerticalProps } from '../data/DataRange';
import Handle from '../primitives/Handle';
import Clip from '../primitives/Clip';

interface RangeSeriesProps {
  data: Array<{
    anchor: Point;
    ranges?: number[];
  }>;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck | null;
  renderAnchor?: React.FC<DataPointProps>;
  renderRanges?:
    | React.FC<DataRangeVerticalProps>
    | Array<React.FC<DataRangeVerticalProps>>;
}

export const RangeVerticalSeries: React.FC<RangeSeriesProps &
  ChartEventHandlers> = (props) => {
  const { cartesianBox } = useChartState();
  const chartStyle = useChartStyle(props.chartStyle);

  const view = normalize(props.view, cartesianBox);
  const clipPath = view ? createViewbox(view).toPath() : null;

  const Anchor = props.renderAnchor || DataAnchorLine;
  const renderRanges = Array.isArray(props.renderRanges)
    ? props.renderRanges
    : props.renderRanges
    ? [props.renderRanges]
    : [DataWhiskerVertical];

  return (
    <Clip path={clipPath}>
      {props.data.map(({ anchor, ranges }) => {
        const [x, y] = anchor;

        const rangePairs = ranges
          ? ranges
              .slice(0, ranges.length - 1)
              .map((val, i) => [val, ranges[i + 1]])
          : [];

        return (
          <Handle
            {...selectHandlers(props)}
            elementPosition={[x, y]}
            meta={props.handlerMeta}
            key={x}
          >
            <Anchor x={x} y={y} chartStyle={chartStyle} />
            {rangePairs.map((pair, i) => {
              const Range =
                renderRanges[i % renderRanges.length] || DataWhiskerVertical;
              return (
                <Range
                  x={anchor[0]}
                  yMin={pair[0]}
                  yMax={pair[1]}
                  chartStyle={chartStyle}
                  key={i}
                />
              );
            })}
          </Handle>
        );
      })}
    </Clip>
  );
};
