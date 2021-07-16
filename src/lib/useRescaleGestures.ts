import { useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useChartState from '../components/base/ChartState';
import Viewbox from '../lib/Viewbox';
import { GestureKind, GesturePhase, ChartGestureData } from '../types';

export default (onGesture: (data: ChartGestureData) => void = () => null) => {
  const { scaleX, scaleY, cartesianBox } = useChartState();
  const [boxStart, setBoxStart] = useState(cartesianBox);

  const moveViewbox = (state: FullGestureState<'drag'>): Viewbox => {
    const distanceX = scaleX.invert(0) - scaleX.invert(state.movement[0]);
    const distanceY = scaleY.invert(0) - scaleY.invert(state.movement[1]);
    return boxStart.panX(distanceX).panY(distanceY);
  };

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
      const nextView = moveViewbox(state);
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.Continue,
        nextView,
        state,
      });
    },
    onDragEnd: (state) => {
      const nextViewFromPan = moveViewbox(state);
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.End,
        nextView: nextViewFromPan,
        state,
      });

      let nextView: Viewbox | null;
      if (state.swipe[0] === -1) {
        nextView = boxStart.panX(boxStart.width);
      } else if (state.swipe[0] === 1) {
        nextView = boxStart.panX(boxStart.width * -1);
      } else if (state.swipe[1] === -1) {
        nextView = boxStart.panY(boxStart.height);
      } else if (state.swipe[1] === 1) {
        nextView = boxStart.panY(boxStart.height * -1);
      } else {
        nextView = null;
      }

      if (nextView) {
        onGesture({
          kind: GestureKind.Swipe,
          phase: GesturePhase.End,
          nextView,
          state,
        });
      }
      setBoxStart(nextView || nextViewFromPan);
    },
    // TODO: pinch and wheel events
  });
};
