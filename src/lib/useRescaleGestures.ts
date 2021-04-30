import { useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useChartState from '../components/base/ChartState';
import Viewbox from '../lib/Viewbox';
import { GestureKind, GesturePhase, HypocubeGestureData } from '../types';

// The purpose of this hook is to fire an onGesture callback that allows
// the developer to update the viewbox or perform other actions.

// The nextView property passed to this callback represents Hypocube's
// "best guess" as to where the user is trying to move the viewbox. IE
// it takes into account the drag distance etc.. but NOT the eventual
// bounding box. The new view can instead be bounded by the developer outside
// of this function.
export default (
  onGesture: (data: HypocubeGestureData) => void = () => null
) => {
  const { scaleX, scaleY, cartesianBox } = useChartState();

  // Track the location of the box when the gesture started, for the purposes
  // of calculating how far it has moved.
  const [boxStart, setBoxStart] = useState(cartesianBox);

  // Generic function for panning the viewbox in response to gestures, eg
  // drag.
  const panViewbox = (state: FullGestureState<'drag'>): Viewbox => {
    const distanceX = scaleX.invert(0) - scaleX.invert(state.movement[0]);
    const distanceY = scaleY.invert(0) - scaleY.invert(state.movement[1]);
    return boxStart.panX(distanceX).panY(distanceY);
  };

  const zoomViewbox = (state: FullGestureState<'pinch'>): Viewbox => {
    const distanceX = scaleX.invert(0) - scaleX.invert(state.offset[0] * -1);
    const distanceY = scaleY.invert(0) - scaleY.invert(state.offset[1] * -1);
    return boxStart.zoomX(distanceX).zoomY(distanceY);
  };

  return useGesture({
    /**
     * DRAG GESTURES (swipe is determined automatically by react-use-gesture)
     */

    // On start, emit the current location and save it to state.
    onDragStart: (state) => {
      setBoxStart(cartesianBox);
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.Start,
        nextView: cartesianBox,
        state,
      });
    },

    // As drag proceeds, update the nextView based on how far the drag has gone.
    onDrag: (state) => {
      const nextView = panViewbox(state);
      onGesture({
        kind: GestureKind.Drag,
        phase: GesturePhase.Continue,
        nextView,
        state,
      });
    },

    // onDragEnd first updates the nextView similar to onDrag.
    // It then checks for swipe events, and if a swipe is detected, it moves
    // the view ONE FULL chart-width over (or up/down).
    onDragEnd: (state) => {
      const isSwipe = !!state.swipe.find(Boolean);

      const nextView = (() => {
        switch (true) {
          case state.swipe[0] === -1:
            return boxStart.panX(boxStart.width);

          case state.swipe[0] === 1:
            return boxStart.panX(boxStart.width * -1);

          case state.swipe[1] === -1:
            return boxStart.panY(boxStart.height);

          case state.swipe[1] === 1:
            return boxStart.panY(boxStart.height * -1);
        }

        return panViewbox(state);
      })();

      onGesture({
        kind: isSwipe ? GestureKind.Swipe : GestureKind.Drag,
        phase: GesturePhase.End,
        nextView,
        state,
      });

      // set the box start to this updated view
      setBoxStart(nextView);
    },

    /**
     * PINCH EVENTS
     */
    onPinchStart: (state) => {
      setBoxStart(cartesianBox);
      onGesture({
        kind: GestureKind.Pinch,
        phase: GesturePhase.Start,
        nextView: cartesianBox,
        state,
      });
    },

    onPinch: (state) => {
      const nextView = zoomViewbox(state);
      onGesture({
        kind: GestureKind.Pinch,
        phase: GesturePhase.Continue,
        nextView: zoomViewbox(state),
        state,
      });
      setBoxStart(nextView);
    },

    onPinchEnd: (state) => {
      const nextView = zoomViewbox(state);
      onGesture({
        kind: GestureKind.Pinch,
        phase: GesturePhase.End,
        nextView,
        state,
      });
      setBoxStart(nextView);
    },
  });
};
