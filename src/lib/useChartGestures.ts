import React, { useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import useChartState from '../components/base/ChartState';
import Viewbox from '../api/Viewbox';
import {
  GesturePhase,
  ChartGestureEvent,
  GestureIntent,
  Point,
} from '../types';
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

const zoom = (
  box: Viewbox,
  factor: number,
  event: any,
  scaleX: SL,
  scaleY: SL,
  containerNode?: React.RefObject<HTMLDivElement>
) => {
  // if ref to the Chart node is availabe, use that to determine the
  // anchor point for the zoom operation
  const offsets = containerNode?.current
    ? containerNode.current.getBoundingClientRect()
    : null;
  const position =
    offsets && event.clientX && event.clientY
      ? ([
          scaleX.invert(event.clientX - offsets.x),
          scaleY.invert(event.clientY - offsets.y),
        ] as Point)
      : undefined;
  return box.zoom(factor, position);
};

export default (
  onGesture: (data: ChartGestureEvent) => void = () => null,
  containerNode?: React.RefObject<HTMLDivElement>
) => {
  const ref = useRef(null);
  const { cartesianBox, scaleX, scaleY } = useChartState();
  const [start, setStart] = useState<Viewbox>(cartesianBox);

  useGesture(
    {
      onDragStart: (state) => {
        onGesture({
          phase: GesturePhase.Start,
          intent: GestureIntent.Scroll,
          start: cartesianBox,
          next: cartesianBox,
          state,
          meta: [],
        });
      },
      onDrag: (state) => {
        onGesture({
          phase: GesturePhase.Continue,
          intent: GestureIntent.Scroll,
          start,
          next: pan(cartesianBox, state.delta, scaleX, scaleY),
          state,
          meta: [],
        });
      },
      onDragEnd: (state) => {
        let nextView: Viewbox | null;
        if (state.swipe[0] === -1) {
          nextView = start.panX(start.width);
        } else if (state.swipe[0] === 1) {
          nextView = start.panX(start.width * -1);
        } else if (state.swipe[1] === -1) {
          nextView = start.panY(start.height * -1);
        } else if (state.swipe[1] === 1) {
          nextView = start.panY(start.height);
        } else {
          nextView = pan(start, state.movement, scaleX, scaleY);
        }

        onGesture({
          phase: GesturePhase.End,
          intent:
            state.swipe[0] || state.swipe[1]
              ? GestureIntent.Swipe
              : GestureIntent.Scroll,
          start,
          next: nextView,
          state,
          meta: [],
        });
        setStart(nextView);
      },

      /**
       * When connected to a trackpad, browsers report 2-finger scroll
       * gestures as Wheel events. Map Wheel events on the x-axis as
       * Drag gestures.
       * Also preventDefault() on these events to stop back/forward behavoir
       * on the page.
       */
      onWheelStart: (state) => {
        setStart(cartesianBox);

        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();
          onGesture({
            phase: GesturePhase.Start,
            intent: GestureIntent.Scroll,
            start: cartesianBox,
            next: cartesianBox,
            state,
            meta: ['trackpad'],
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
            start,
            next: start.panX(disp(scaleX, state.movement[0]) * -1),
            state,
            meta: ['trackpad'],
          });
        }
      },
      onWheelEnd: (state) => {
        if (state.axis === 'x') {
          state.event.preventDefault();
          state.event.stopPropagation();

          const next = start.panX(disp(scaleX, state.movement[0]) * -1);
          onGesture({
            phase: GesturePhase.End,
            intent: GestureIntent.Scroll,
            start,
            next,
            state,
            meta: ['trackpad'],
          });
          setStart(next);
        }
      },

      onPinchStart: (state) => {
        state.event.preventDefault();
        state.event.stopPropagation();
        setStart(cartesianBox);
        onGesture({
          intent: GestureIntent.Zoom,
          phase: GesturePhase.Start,
          start: cartesianBox,
          next: cartesianBox,
          state,
          meta: ['pinch'],
        });
      },

      onPinch: (state) => {
        state.event.preventDefault();
        state.event.stopPropagation();

        console.log(state);

        const next = zoom(
          start,
          Math.pow(2, state.movement[0]),
          state.event,
          scaleX,
          scaleY,
          containerNode
        );

        onGesture({
          intent: GestureIntent.Zoom,
          phase: GesturePhase.Continue,
          start: cartesianBox,
          next,
          state,
          meta: ['pinch'],
        });
      },

      onPinchEnd: (state) => {
        state.event.preventDefault();
        state.event.stopPropagation();
        const next = zoom(
          start,
          Math.pow(2, state.movement[0]),
          state.event,
          scaleX,
          scaleY,
          containerNode
        );

        console.log('end', next);

        onGesture({
          intent: GestureIntent.Zoom,
          phase: GesturePhase.End,
          start: cartesianBox,
          next,
          state,
          meta: ['pinch'],
        });
        setStart(next);
      },
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
