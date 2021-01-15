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
  axisTickLabelOffset: 28,
  axisLabelOffset: 50,
};

const contextualizeStyles = (
  overrides: ChartStyleOptions,
  defaults: ChartStyleT,
  state: ChartState
): ChartStyleT => {
  return Object.keys(defaults).reduce(
    (styles, key: keyof ChartStyleOptions) => {
      return {
        [key]: contextualize(overrides[key], defaults[key], state),
        ...styles,
      };
    },
    defaults
  );
};

export const ChartStyleContext = React.createContext<ChartStyleT>(baseStyles);

export const ChartStyleProvider: React.FC<ChartStyleOptions> = (props) => {
  const state = useChartState();

  const rootStyles = contextualizeStyles(props, baseStyles, state);

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
