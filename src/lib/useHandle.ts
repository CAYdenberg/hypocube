import { useCallback, useMemo } from 'react';
import useChartState from '../components/base/ChartState';
import { REMAPPED_EVENTS } from '../constants';
import {
  HypocubeEventData,
  HypocubeHandler,
  HypocubeHandlers,
  ReactEvent,
  ReactHandlers,
} from '../types';

export interface HandlerProps extends HypocubeHandlers {
  elementPosition?: [number, number];
  meta?: Record<string, string | number | boolean | null>;
}

export default ({ elementPosition, meta, ...handlers }: HandlerProps) => {
  const { scaleX, scaleY, containerOffset } = useChartState();

  const getData = useCallback(
    (event: ReactEvent): HypocubeEventData => {
      return {
        meta: meta || {},
        elementPosition,
        event,
        pointerId: (event as React.PointerEvent).pointerId || null,
        pointerPosition: [
          scaleX.invert(event.clientX - containerOffset[0]),
          scaleY.invert(event.clientY - containerOffset[1]),
        ],
        modifiers: [
          event.altKey && 'alt',
          event.ctrlKey && 'ctrl',
          event.shiftKey && 'shift',
        ].filter(Boolean) as Array<string>,
      };
    },
    [meta, elementPosition, scaleX, scaleY, containerOffset]
  );

  const reactHandlers = useMemo(() => {
    return REMAPPED_EVENTS.reduce((rhandlers, key) => {
      const handler = handlers[key] as HypocubeHandler | undefined;
      if (handler) {
        rhandlers[key] = (event: ReactEvent) => {
          event.preventDefault();
          return handler(getData(event));
        };
      }
      return rhandlers;
    }, {} as ReactHandlers);
  }, [getData, handlers]);

  return reactHandlers;
};
