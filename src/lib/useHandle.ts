import { useCallback, useMemo } from 'react';
import useChartState from '../components/base/ChartState';
import {
  ChartEventData,
  ChartEventMetaData,
  ChartEventHandlers,
  ReactEvent,
  ReactHandlers,
} from '../types';
import selectHandlers from './selectHandlers';

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
}: HandlerProps): ReactHandlers => {
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
    return selectHandlers(handlers, (handler) => {
      return (event: ReactEvent) => {
        event.preventDefault();
        return handler(getData(event));
      };
    });
  }, [getData, handlers]);

  return reactHandlers;
};
