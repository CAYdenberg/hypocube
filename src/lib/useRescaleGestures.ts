import { useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useChartState from '../components/base/ChartState';
import {
  Range,
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

  const moveViewbox = (state: FullGestureState<'drag'>): Viewbox => {
    return {
      x: [
        boxStart.x[0] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
        boxStart.x[1] + scaleX.invert(0) - scaleX.invert(state.movement[0]),
      ],
      y: [
        boxStart.y[0] + scaleY.invert(0) - scaleY.invert(state.movement[1]),
        boxStart.y[1] + scaleY.invert(0) - scaleY.invert(state.movement[1]),
      ],
    };
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
      const widthX = boxStart.x[1] - boxStart.x[0];
      const widthY = boxStart.y[1] - boxStart.y[0];
      if (state.swipe[0] === -1) {
        nextView = {
          x: boxStart.x.map((val) => val - widthX) as Range,
          y: boxStart.y,
        };
      } else if (state.swipe[0] === 1) {
        nextView = {
          x: boxStart.x.map((val) => val + widthX) as Range,
          y: boxStart.y,
        };
      } else if (state.swipe[1] === -1) {
        nextView = {
          x: boxStart.x,
          y: boxStart.y.map((val) => val - widthY) as Range,
        };
      } else if (state.swipe[1] === 1) {
        nextView = {
          x: boxStart.x,
          y: boxStart.y.map((val) => val + widthY) as Range,
        };
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
