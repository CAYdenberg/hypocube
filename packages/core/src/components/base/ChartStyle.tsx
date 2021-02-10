import React, { useContext } from 'react';
import { contextualize } from '../../lib/normalize';
import type { ChartState, ChartStyleOptions, ChartStyleT } from '../../types';
import useChartState from './ChartState';

const baseStyles: ChartStyleT = {
  baseFontSize: 16,
  axisColor: '#666',
  axisThickness: 2,
  axisTickLength: 10,
  axisTickOffset: 0,
  axisTickLabelOffset: 2,
  axisLabelOffset: 50,

  dataFill: '#000',
  dataStroke: '#000',
  dataStrokeWidth: 1,
  dataBoxThickness: 10,
  dataPointSize: 8,
  dataPointSymbol: 'circle',
  dataLineCurveType: 'linear',
  dataLineDashType: 'solid',
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
