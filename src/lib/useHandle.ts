import { useCallback, useMemo } from 'react';
import useChartState from '../components/base/ChartState';
import { SUPPORTED_EVENTS } from '../constants';
import {
  ChartEventData,
  ChartEventMetaData,
  ChartEventHandler,
  ChartEventHandlers,
  ReactEvent,
  ReactHandlers,
} from '../types';

export interface HandlerProps extends ChartEventHandlers {
  elementPosition?: [number, number];
  meta?: ChartEventMetaData;
  mapEventData?: (data: ChartEventData) => ChartEventData;
}

export default ({
  elementPosition,
  meta,
  mapEventData,
  ...handlers
}: HandlerProps) => {
  const { scaleX, scaleY, containerOffset } = useChartState();

  const getData = useCallback(
    (event: ReactEvent): ChartEventData => {
      const data: ChartEventData = {
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

      return mapEventData ? mapEventData(data) : data;
    },
    [meta, elementPosition, mapEventData, scaleX, scaleY, containerOffset]
  );

  const reactHandlers = useMemo(() => {
    return SUPPORTED_EVENTS.reduce((rhandlers, key) => {
      const handler = handlers[key] as ChartEventHandler;
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
