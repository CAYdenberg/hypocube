import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  PointYRange,
} from '../../types';
import { arrayRepeater, normalize } from '../../lib/normalize';
import { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import selectHandlers from '../../lib/selectHandlers';
import { DataRangeCap, DataPointProps } from '../data/DataPoint';
import { DataRangeVertical, DataRangeVerticalProps } from '../data/DataRange';
import Handle from '../primitives/Handle';
import Clip from '../primitives/Clip';
interface RangeSeriesProps {
  data: Array<PointYRange>;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck | null;
  renderCaps?: React.FC<DataPointProps> | Array<React.FC<DataPointProps>>;
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

  const renderCaps = arrayRepeater(normalize(props.renderCaps, DataRangeCap));
  const renderRanges = arrayRepeater(
    normalize(props.renderRanges, DataRangeVertical)
  );

  return (
    <Clip path={clipPath}>
      {props.data.map(([x, ranges]: PointYRange) => {
        if (!ranges.length) {
          return null;
        }

        const rangePairs = ranges
          .slice(0, ranges.length - 1)
          .map((val, i) => [val, ranges[i + 1]]);

        return (
          <Handle
            {...selectHandlers(props)}
            elementPosition={[x, ranges[0]]}
            meta={props.handlerMeta}
            key={x}
          >
            {ranges.map((y, i) => {
              const Cap = renderCaps(i);
              return <Cap x={x} y={y} key={i} chartStyle={chartStyle} />;
            })}
            {rangePairs.map((pair, i) => {
              const Range = renderRanges(i);
              return (
                <Range
                  x={x}
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
