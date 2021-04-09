import React, { useContext } from 'react';
import { contextualize } from '../../lib/normalize';
import useChartState from './ChartState';
import { ChartState, ChartStyleOptions, ChartStyleT } from '../../types';

const baseStyles: ChartStyleT = {
  baseFontSize: 16,
  axisColor: '#666',
  axisThickness: 2,
  axisTickLength: 10,
  axisTickOffset: 0,
  axisTickLabelOffset: 2,
  axisLabelOffset: 50,

  dataBoxFill: '#000',
  dataBoxStroke: '#000',
  dataBoxStrokeWidth: 0,
  dataBoxThickness: 10,

  dataPointSize: 5,
  dataPointSymbol: 'none',
  dataPointFill: '#000',
  dataPointStroke: '#000',
  dataPointStrokeWidth: 0,
  dataPointMinTargetRadius: 0,

  dataLineCurveType: 'linear',
  dataLineDashType: 'solid',
  dataLineStroke: '#000',
  dataLineStrokeWidth: 1,
};

const contextualizeStyles = (
  overrides: ChartStyleOptions,
  defaults: ChartStyleT,
  state: ChartState
): ChartStyleT => {
  return Object.keys(defaults).reduce(
    (styles, key: keyof ChartStyleOptions) => {
      return {
        ...styles,
        [key]: contextualize(overrides[key], defaults[key], state),
      };
    },
    defaults
  );
};

export const ChartStyleContext = React.createContext<ChartStyleT>(baseStyles);

export const ChartStyleProvider: React.FC<{
  rootStyles: ChartStyleOptions;
}> = (props) => {
  const state = useChartState();

  const rootStyles = contextualizeStyles(props.rootStyles, baseStyles, state);

  return (
    <ChartStyleContext.Provider value={rootStyles}>
      {props.children}
    </ChartStyleContext.Provider>
  );
};

export const useChartStyles = (overrides?: ChartStyleOptions): ChartStyleT => {
  const state = useChartState();
  const rootStyles = useContext(ChartStyleContext);
  if (!overrides) return rootStyles;
  return contextualizeStyles(overrides, rootStyles, state);
};
