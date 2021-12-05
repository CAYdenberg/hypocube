import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import useChartState from '../base/ChartState';
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';
import Clip from '../primitives/Clip';
import { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import { normalize } from '../../lib/normalize';
import { closeLineToEdge } from '../../lib/area';
import { Line } from '../primitives/Line';

interface LineSeriesProps {
  topLine: Point[];
  bottomLine?: Point[];
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck;
}

export const AreaSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
  props
) => {
  const state = useChartState();
  const { cartesianBox } = state;
  const chartStyle = useChartStyle(props.chartStyle);

  const view = createViewbox(normalize(props.view, cartesianBox));
  const clipPath = view ? createViewbox(view).toPath() : null;

  const areaUnder = closeLineToEdge(props.topLine, view.yMin);
  const areaOver = props.bottomLine
    ? closeLineToEdge(props.bottomLine, view.yMax)
    : null;

  return (
    <Clip path={clipPath}>
      <Handle {...selectHandlers(props)} meta={props.handlerMeta}>
        {areaUnder && (
          <Clip path={areaOver}>
            <Line
              path={areaUnder}
              strokeWidth={0}
              fill="#003f5c"
              opacity={0.3}
            />
          </Clip>
        )}
      </Handle>
    </Clip>
  );
};
