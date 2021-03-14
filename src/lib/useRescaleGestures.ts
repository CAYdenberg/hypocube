import { useState } from 'react';
import { useGesture } from 'react-use-gesture';
import useChartState from '../components/base/ChartState';
import {
  GestureKind,
  GesturePhase,
  HypocubeGestureData,
  Viewbox,
} from '../types';

export default (
  onGesture: (data: HypocubeGestureData) => void = () => null
) => {
  const { scaleX, scaleY, cartesianBox } = useChartState();
  const [boxStart, setBoxStart] = useState(cartesianBox);

  return useGesture({
    onDragStart: (state) => {
      setBoxStart(cartesianBox);
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.Start,
        nextView: cartesianBox,
        state,
      });
    },
    onDrag: (state) => {
      const nextView: Viewbox = {
        x: [
          boxStart.x[0] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
          boxStart.x[1] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
        ],
        y: [
          boxStart.y[0] + scaleY.invert(0) - scaleY.invert(state.movement[1]),
          boxStart.y[1] + scaleY.invert(0) - scaleY.invert(state.movement[1]),
        ],
      };
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.Continue,
        nextView,
        state,
      });
    },
  });
};
