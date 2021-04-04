import { scaleLinear } from 'd3-scale';
import React, { useContext } from 'react';
import Viewbox from '../../lib/Viewbox';
import { ChartState } from '../../types';

export const getDefaultState = (): ChartState => ({
  isCanvas: false,
  cartesianBox: new Viewbox(0, 0, 1, 1),
  pxBox: new Viewbox(0, 0, 1, 1),
  scaleX: scaleLinear(),
  scaleY: scaleLinear(),
  containerOffset: [0, 0],
  pushToCanvasQueue: () => undefined,
});

export const ChartStateContext = React.createContext<ChartState>(
  getDefaultState()
);

const useChartState = () => {
  return useContext(ChartStateContext);
};

export default useChartState;
