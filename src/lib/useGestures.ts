import { useCallback, useEffect, useState } from 'react';
import { HypocubeEventData, Point } from '../types';

type Deltas = Array<{
  deltaX: number;
  deltaY: number;
}>;

export type TouchPoint = { start: Point; now: Point; pointerId: number };

export const applyTouchPoints = (
  pointerId: number | null,
  updates: Partial<TouchPoint> | null
) => (state: TouchPoint[]): TouchPoint[] => {
  if (pointerId === null) {
    return state;
  }

  if (!state.find((touchPoint) => touchPoint.pointerId)) {
    if (!updates || !updates.start || !updates.now) {
      return state;
    }
    return state.concat({
      start: updates.start,
      now: updates.now,
      pointerId,
    });
  }

  return state
    .map((touchPoint) => {
      if (touchPoint.pointerId === pointerId) {
        if (updates === null) return null;
        return {
          ...touchPoint,
          ...updates,
        };
      }
    })
    .filter(Boolean) as TouchPoint[];
};

export default (onDrag?: (deltas: Deltas) => void, onDragEnd?: () => void) => {
  const [touchPoints, updateTouchPoints] = useState<TouchPoint[]>([]);

  const onPointerDown = useCallback((event: HypocubeEventData) => {
    updateTouchPoints(
      applyTouchPoints(event.pointerId, {
        start: event.pointerPosition,
        now: event.pointerPosition,
      })
    );
  }, []);

  const onPointerUp = useCallback((event: HypocubeEventData) => {
    updateTouchPoints(applyTouchPoints(event.pointerId, null));
  }, []);

  const onPointerMove = useCallback((event: HypocubeEventData) => {
    updateTouchPoints(
      applyTouchPoints(event.pointerId, {
        now: event.pointerPosition,
      })
    );
  }, []);

  useEffect(() => {
    const actualPoints = touchPoints.filter(Boolean) as Array<{
      start: Point;
      now: Point;
    }>;

    if (!actualPoints.length && onDragEnd) onDragEnd();

    if (!onDrag) return;
    const deltas = actualPoints.map((point) => ({
      deltaX: point.now[0] - point.start[0],
      deltaY: point.now[1] - point.start[1],
    }));
    onDrag(deltas);
  }, [touchPoints]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave: onPointerUp,
    onPointerOut: onPointerUp,
  };
};
