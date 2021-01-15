import { scaleLinear } from 'd3-scale';
import React, { useContext } from 'react';
import { ChartState } from '../../types';

export const ChartStateContext = React.createContext<ChartState>({
  isCanvas: false,
  cartesianBox: { x: [0, 1], y: [0, 1] },
  pxBox: { x: [0, 1], y: [0, 1] },
  scaleX: scaleLinear(),
  scaleY: scaleLinear(),
  renderer: null,
  containerOffset: [0, 0],
});

const useChartState = () => {
  return useContext(ChartStateContext);
};

export default useChartState;
