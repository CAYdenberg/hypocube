import { useCallback, useMemo } from 'react';
import useChartState from '../components/base/ChartState';
import { SUPPORTED_EVENTS } from '../constants';
import {
  HypocubeEventData,
  HypocubeHandler,
  HypocubeHandlers,
  ReactEvent,
  ReactHandlers,
} from '../types';

export interface HandlerProps extends HypocubeHandlers {
  elementPosition?: [number, number];
  meta?: {
    [key: string]: string | number | boolean;
  };
}

export default ({ elementPosition, meta, ...handlers }: HandlerProps) => {
  const { scaleX, scaleY, containerOffset } = useChartState();

  const getData = useCallback(
    (event: ReactEvent): HypocubeEventData => {
      return {
        meta: meta || {},
        elementPosition,
        event,
        pointerPosition: [
          scaleX.invert(event.clientX - containerOffset[0]),
          scaleY.invert(event.clientY - containerOffset[1]),
        ],
      };
    },
    [meta, elementPosition, scaleX, scaleY, containerOffset]
  );

  const reactHandlers = useMemo(() => {
    return SUPPORTED_EVENTS.reduce((rhandlers, key) => {
      const handler = handlers[key] as HypocubeHandler;
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
