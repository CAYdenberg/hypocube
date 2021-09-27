import React, { useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import useChartState from '../components/base/ChartState';
import Viewbox from './Viewbox';
import { GesturePhase, ChartGestureData, GestureIntent, Point } from '../types';
import { ScaleLinear } from 'd3-scale';

const disp = (scale: ScaleLinear<number, number, number>, movement: number) => {
  return scale.invert(0) - scale.invert(movement);
};

export default (
  onGesture: (data: ChartGestureData) => void = () => null,
  containerNode?: React.RefObject<HTMLDivElement>,
  enableMousewheelZoom?: boolean
) => {
  const ref = useRef(null);
  const { cartesianBox, scaleX, scaleY } = useChartState();
  const [start, setStart] = useState<Viewbox>(cartesianBox);

  const pan = (box: Viewbox, movement: [number, number]) =>
    box.panX(disp(scaleX, movement[0])).panY(disp(scaleY, movement[1]));

  const zoom = (box: Viewbox, factor: number, event: any) => {
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

  useGesture(
    {
      onDragStart: (state) => {
        setStart(cartesianBox);
        onGesture({
          phase: GesturePhase.Start,
          intent: GestureIntent.Scroll,
          start: cartesianBox,
          next: cartesianBox,
          state,
        });
      },
      onDrag: (state) => {
        onGesture({
          phase: GesturePhase.Continue,
          intent: GestureIntent.Scroll,
          start,
          next: pan(start, state.movement),
          state,
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
          nextView = pan(start, state.movement);
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
        });
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
          });
        } else {
          onGesture({
            phase: GesturePhase.Start,
            intent: GestureIntent.Zoom,
            start: cartesianBox,
            next: cartesianBox,
            state,
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
          });
        } else if (enableMousewheelZoom) {
          const zoomIn = state.direction[1] > 0;
          // TODO: get the zoom anchor point from the container node offsets
          const next = zoom(start, zoomIn ? 1.2 : 0.8, state.event);
          setStart(next);

          onGesture({
            intent: GestureIntent.Zoom,
            phase: GesturePhase.Continue,
            start,
            next,
            state,
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
            start,
            next: start.panX(disp(scaleX, state.movement[0]) * -1),
            state,
          });
        } else if (enableMousewheelZoom) {
          onGesture({
            intent: GestureIntent.Zoom,
            phase: GesturePhase.End,
            start,
            next: start,
            state,
          });
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
        });
      },

      onPinch: (state) => {
        state.event.preventDefault();
        state.event.stopPropagation();
        const next = zoom(
          start,
          1 * Math.pow(2, state.movement[0]),
          state.event
        );

        onGesture({
          intent: GestureIntent.Zoom,
          phase: GesturePhase.Continue,
          start: cartesianBox,
          next,
          state,
        });
      },

      onPinchEnd: (state) => {
        state.event.preventDefault();
        state.event.stopPropagation();
        const next = zoom(
          start,
          1 * Math.pow(2, state.movement[0]),
          state.event
        );

        onGesture({
          intent: GestureIntent.Zoom,
          phase: GesturePhase.End,
          start: cartesianBox,
          next,
          state,
        });
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
