import React, { useContext } from 'react';
import { contextualize } from '../../lib/normalize';
import useChartState from './ChartState';
import { ChartState, ChartStyleOptions, ChartStyleT } from '../../types';
import { DEFAULT_FONT_FAMILY } from '../../constants';

const baseStyle: ChartStyleT = {
  fontSize: 16,
  fontFamily: DEFAULT_FONT_FAMILY,
  svgPointerEvents: true,
  htmlLayerPointerEvents: true,

  axisColor: '#666',
  axisStrokeWidth: 2,
  axisTickLength: 10,
  axisTickOffset: 0,
  axisTickModulus: 1,
  axisTickLabelOffset: 2,
  axisTickLabelModulus: 1,

  xAxisLabelPosition: 46,
  yAxisLabelPosition: -60,

  seriesXOffset: 0,
  seriesOpacity: 1,

  dataBoxFill: '#000',
  dataBoxStroke: '#000',
  dataBoxStrokeWidth: 0,
  dataBoxThickness: 10,

  dataPointSymbol: 'none',
  dataPointSize: 5,
  dataPointRotation: 0,
  dataPointFill: '#000',
  dataPointStroke: '#000',
  dataPointStrokeWidth: 0,
  dataPointMinTargetRadius: 0,

  dataLineCurveType: 'linear',
  dataLineDashType: 'solid',
  dataLineStroke: '#000',
  dataLineStrokeWidth: 1,

  dataRangeStroke: '#000',
  dataRangeStrokeWidth: 2,
  dataRangeCapLength: 10,

  dataAreaFill: 'rgba(102, 102, 102, 0.2)',

  gridColor: '#666',
  gridDashStyle: 'dotted',
  gridStrokeWidth: 1,
};

const contextualizeStyle = (
  overrides: ChartStyleOptions,
  defaults: ChartStyleT,
  state: ChartState
): ChartStyleT => {
  return Object.keys(defaults).reduce((style, key: keyof ChartStyleOptions) => {
    return {
      ...style,
      [key]: contextualize(overrides[key], defaults[key], state),
    };
  }, defaults);
};

export const ChartStyleContext = React.createContext<ChartStyleT>(baseStyle);

export const ChartStyleProvider: React.FC<{
  chartStyle: ChartStyleOptions;
  children: React.ReactNode;
}> = (props) => {
  const state = useChartState();

  const chartStyle = contextualizeStyle(props.chartStyle, baseStyle, state);

  return (
    <ChartStyleContext.Provider value={chartStyle}>
      {props.children}
    </ChartStyleContext.Provider>
  );
};

export const useChartStyle = (overrides?: ChartStyleOptions): ChartStyleT => {
  const state = useChartState();
  const chartStyle = useContext(ChartStyleContext);
  if (!overrides) return chartStyle;
  return contextualizeStyle(overrides, chartStyle, state);
};
