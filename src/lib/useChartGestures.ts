import { useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import useChartState from '../components/base/ChartState';
import Viewbox from '../api/Viewbox';
import { GesturePhase, ChartGestureEvent, GestureIntent } from '../types';
import { ScaleLinear } from 'd3-scale';

type SL = ScaleLinear<number, number, number>;

const disp = (scale: SL, movement: number) => {
  return scale.invert(0) - scale.invert(movement);
};

const pan = (
  box: Viewbox,
  movement: [number, number],
  scaleX: SL,
  scaleY: SL
) => box.panX(disp(scaleX, movement[0])).panY(disp(scaleY, movement[1]));

// const zoom = (
//   box: Viewbox,
//   factor: number,
//   event: any,
//   scaleX: SL,
//   scaleY: SL,
//   containerNode?: React.RefObject<HTMLDivElement>
// ) => {
//   // if ref to the Chart node is availabe, use that to determine the
//   // anchor point for the zoom operation
//   const offsets = containerNode?.current
//     ? containerNode.current.getBoundingClientRect()
//     : null;
//   const position =
//     offsets && event.clientX && event.clientY
//       ? ([
//           scaleX.invert(event.clientX - offsets.x),
//           scaleY.invert(event.clientY - offsets.y),
//         ] as Point)
//       : undefined;
//   return box.zoom(factor, position);
// };

export default (
  onGesture: (data: ChartGestureEvent) => void = () => null,
  containerNode?: React.RefObject<HTMLDivElement>
) => {
  const ref = useRef(null);
  const { scaleX, scaleY } = useChartState();

  useGesture(
    {
      onDragStart: (state) => {
        onGesture({
          phase: GesturePhase.Start,
          intent: GestureIntent.Scroll,
          state,
          transform: (initial) => initial,
        });
      },
      onDrag: (state) => {
        onGesture({
          phase: GesturePhase.Continue,
          intent: GestureIntent.Scroll,
          state,
          transform: (initial) => pan(initial, state.delta, scaleX, scaleY),
        });
      },
      onDragEnd: (state) => {
        const isSwipe = state.swipe[0] || state.swipe[1];

        onGesture({
          phase: GesturePhase.End,
          intent: isSwipe ? GestureIntent.Swipe : GestureIntent.Scroll,
          state,
          transform: (initial) =>
            isSwipe
              ? initial
                  .panX(state.swipe[0] * initial.width * -1)
                  .panY(state.swipe[1] * initial.height)
              : pan(initial, state.delta, scaleX, scaleY),
        });
      },

      /**
       * When connected to a trackpad, browsers report 2-finger scroll
       * gestures as Wheel events. Map Wheel events on the x-axis as
       * Drag gestures.
       * Also preventDefault() on these events to stop back/forward behaviour
       * on the page.
       */
      onWheelStart: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();
          onGesture({
            phase: GesturePhase.Start,
            intent: GestureIntent.Scroll,
            state,
            transform: (initial) => initial,
          });
        }
      },
      onWheel: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();

          onGesture({
            phase: GesturePhase.Continue,
            intent: GestureIntent.Scroll,
            state,
            transform: (initial) =>
              initial.panX(disp(scaleX, state.delta[0]) * -1),
          });
        }
      },
      onWheelEnd: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();

          onGesture({
            phase: GesturePhase.End,
            intent: GestureIntent.Scroll,
            state,
            transform: (initial) =>
              initial.panX(disp(scaleX, state.delta[0]) * -1),
          });
        }
      },

      // onPinchStart: (state) => {
      //   state.event.preventDefault();
      //   state.event.stopPropagation();
      //   setStart(cartesianBox);
      //   onGesture({
      //     intent: GestureIntent.Zoom,
      //     phase: GesturePhase.Start,
      //     start: cartesianBox,
      //     next: cartesianBox,
      //     state,
      //   });
      // },

      // onPinch: (state) => {
      //   state.event.preventDefault();
      //   state.event.stopPropagation();
      //   const next = zoom(
      //     start,
      //     1 * Math.pow(2, state.movement[0]),
      //     state.event,
      //     scaleX,
      //     scaleY,
      //     containerNode
      //   );

      //   onGesture({
      //     intent: GestureIntent.Zoom,
      //     phase: GesturePhase.Continue,
      //     start: cartesianBox,
      //     next,
      //     state,
      //   });
      // },

      // onPinchEnd: (state) => {
      //   state.event.preventDefault();
      //   state.event.stopPropagation();
      //   const next = zoom(
      //     start,
      //     1 * Math.pow(2, state.movement[0]),
      //     state.event,
      //     scaleX,
      //     scaleY,
      //     containerNode
      //   );

      //   onGesture({
      //     intent: GestureIntent.Zoom,
      //     phase: GesturePhase.End,
      //     start: cartesianBox,
      //     next,
      //     state,
      //   });
      //   setStart(next);
      // },
    },
    {
      target: ref,
      eventOptions: {
        passive: false,
        capture: false,
      },
    }
  );

  return ref;
};
