import React from 'react';
import {
  ChartStyleOptions,
  ChartEventMetaData,
  ChartEventHandlers,
  Point,
} from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import useChartState from '../base/ChartState';
import { DataLine } from '../data/DataSeriesLine';
import selectHandlers from '../../lib/selectHandlers';
import Handle from '../primitives/Handle';
import Clip from '../primitives/Clip';
import { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import { normalize } from '../../lib/normalize';

interface LineSeriesProps {
  topLine: Point[];
  bottomLine: Point[];
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  view?: ViewboxDuck | null;
}

export const AreaSeries: React.FC<LineSeriesProps & ChartEventHandlers> = (
  props
) => {
  const state = useChartState();
  const { cartesianBox } = state;
  const chartStyle = useChartStyle(props.chartStyle);

  const view = normalize(props.view, cartesianBox);
  const clipPath = view ? createViewbox(view).toPath() : null;

  const Line = DataLine;

  return (
    <Clip path={clipPath}>
      <Handle {...selectHandlers(props)} meta={props.handlerMeta}>
        <Line data={props.topLine} chartStyle={chartStyle} />
      </Handle>
    </Clip>
  );
};
