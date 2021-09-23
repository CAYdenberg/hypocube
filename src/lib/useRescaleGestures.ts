import { useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import useChartState from '../components/base/ChartState';
import Viewbox from '../lib/Viewbox';
import { GestureKind, GesturePhase, ChartGestureData } from '../types';
import { ScaleLinear } from 'd3-scale';

const disp = (scale: ScaleLinear<number, number, number>, movement: number) => {
  return scale.invert(0) - scale.invert(movement);
};

export default (onGesture: (data: ChartGestureData) => void = () => null) => {
  const ref = useRef(null);
  const { scaleX, scaleY, cartesianBox } = useChartState();
  const [boxStart, setBoxStart] = useState(cartesianBox);

  useGesture(
    {
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
        const nextView = boxStart
          .panX(disp(scaleX, state.movement[0]))
          .panY(disp(scaleY, state.movement[1]));
        onGesture({
          kind: GestureKind.Drag,
          phase: GesturePhase.Continue,
          nextView,
          state,
        });
      },
      onDragEnd: (state) => {
        const nextViewFromPan = boxStart
          .panX(disp(scaleX, state.movement[0]))
          .panY(disp(scaleY, state.movement[1]));
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
          nextView = boxStart.panY(boxStart.height * -1);
        } else if (state.swipe[1] === 1) {
          nextView = boxStart.panY(boxStart.height);
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

      /**
       * When connected to a trackpad, browsers report 2-finger scroll
       * gestures as Wheel events. Map Wheel events on the x-axis as
       * Drag gestures.
       * Also preventDefault() on these events to stop back/forward behavoir
       * on the page.
       */
      onWheelStart: (state) => {
        setBoxStart(cartesianBox);

        let kind: GestureKind;
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();
          kind = GestureKind.Drag;
        } else {
          // kind = GestureKind.Wheel;
          return;
        }

        onGesture({
          kind,
          phase: GesturePhase.Start,
          nextView: cartesianBox,
          state,
        });
      },
      onWheel: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();

          const nextView = boxStart.panX(disp(scaleX, state.movement[0]) * -1);
          onGesture({
            kind: GestureKind.Drag,
            phase: GesturePhase.Continue,
            nextView,
            state,
          });
          return;
        }

        // const nextView = boxStart
        //   .zoomX(disp(scaleX, state.delta[1]) * -1)
        //   .zoomY(disp(scaleY, state.delta[1]));
        // onGesture({
        //   kind: GestureKind.Wheel,
        //   phase: GesturePhase.Continue,
        //   nextView,
        //   state,
        // });
        // setBoxStart(nextView);
      },
      onWheelEnd: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();

          const nextView = boxStart.panX(disp(scaleX, state.movement[0]) * -1);
          onGesture({
            kind: GestureKind.Drag,
            phase: GesturePhase.End,
            nextView,
            state,
          });
          setBoxStart(nextView);
          return;
        }

        // const nextView = boxStart
        //   .zoomX(disp(scaleX, state.delta[1]) * -1)
        //   .zoomY(disp(scaleY, state.delta[1]));
        // onGesture({
        //   kind: GestureKind.Wheel,
        //   phase: GesturePhase.End,
        //   nextView,
        //   state,
        // });
        // setBoxStart(nextView);
      },

      // onPinchStart: (state) => {
      //   setBoxStart(cartesianBox);
      //   onGesture({
      //     kind: GestureKind.Pinch,
      //     phase: GesturePhase.Start,
      //     nextView: cartesianBox,
      //     state,
      //   });
      // },

      // onPinch: (state) => {
      //   const nextView = boxStart
      //     .zoomX(disp(scaleX, state.movement[0]))
      //     .zoomY(disp(scaleY, state.movement[0]));
      //   onGesture({
      //     kind: GestureKind.Pinch,
      //     phase: GesturePhase.Continue,
      //     nextView,
      //     state,
      //   });
      // },

      // onPinchEnd: (state) => {
      //   const nextView = boxStart
      //     .zoomX(disp(scaleX, state.movement[0]))
      //     .zoomY(disp(scaleY, state.movement[0]));
      //   onGesture({
      //     kind: GestureKind.Pinch,
      //     phase: GesturePhase.Continue,
      //     nextView,
      //     state,
      //   });
      //   setBoxStart(nextView);
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
