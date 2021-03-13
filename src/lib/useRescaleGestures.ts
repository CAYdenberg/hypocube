import { useState } from 'react';
import { useGesture } from 'react-use-gesture';
import useChartState from '../components/base/ChartState';
import { GestureKind, HypocubeGestureHandlers, Viewbox } from '../types';

export default ({
  onGestureStart,
  onGestureContinue,
}: HypocubeGestureHandlers) => {
  const { scaleX, scaleY, cartesianBox, pxBox } = useChartState();
  const [boxStart, setBoxStart] = useState(cartesianBox);

  return useGesture({
    onMoveStart: (state) => {
      setBoxStart(cartesianBox);
      if (!onGestureStart) {
        return;
      }
      onGestureStart(GestureKind.Drag, cartesianBox, state);
    },
    onMove: (state) => {
      if (!onGestureContinue) {
        return;
      }
      console.log(scaleX.invert(0) - scaleX.invert(state.movement[0]));
      const nextViewbox: Viewbox = {
        x: [
          boxStart.x[0] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
          boxStart.x[1] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
        ],
        y: [
          boxStart.y[0] + scaleY.invert(state.movement[1]),
          boxStart.y[1] + scaleY.invert(state.movement[1]),
        ],
      };
      onGestureContinue(GestureKind.Drag, nextViewbox, state);
    },
  });
};
