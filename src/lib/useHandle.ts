import React, { useCallback, useMemo } from 'react';
import useChartState from '../components/base/ChartState';
import {
  ChartEvent,
  ChartEventMetaData,
  ChartEventHandlers,
  ReactEvent,
  ReactHandlers,
} from '../types';
import selectHandlers from './selectHandlers';

export interface HandlerProps extends ChartEventHandlers {
  elementPosition?: [number, number];
  meta?: ChartEventMetaData;
  containerNode?: React.RefObject<HTMLDivElement>;
}

export default ({
  elementPosition,
  meta,
  containerNode,
  ...handlers
}: HandlerProps): ReactHandlers => {
  const { scaleX, scaleY } = useChartState();

  const getData = useCallback(
    (event: ReactEvent): ChartEvent => {
      const offsets = containerNode?.current
        ? containerNode.current.getBoundingClientRect()
        : null;

      const data: ChartEvent = {
        meta: meta || {},
        elementPosition,
        event,
        pointerId: (event as React.PointerEvent).pointerId || null,
        pointerPosition: offsets
          ? [
              scaleX.invert(event.clientX - offsets.x),
              scaleY.invert(event.clientY - offsets.y),
            ]
          : undefined,
        modifiers: [
          event.altKey && 'alt',
          event.ctrlKey && 'ctrl',
          event.shiftKey && 'shift',
        ].filter(Boolean) as Array<string>,
      };

      return data;
    },
    [meta, elementPosition, scaleX, scaleY, containerNode]
  );

  const reactHandlers = useMemo(() => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return selectHandlers(handlers, (handler: any) => {
      return (event: ReactEvent) => {
        event.preventDefault();
        return handler(getData(event));
      };
    });
  }, [getData, handlers]);

  return reactHandlers;
};
