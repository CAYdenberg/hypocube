import { SUPPORTED_EVENTS } from '../constants';
import { ChartEventHandler, ChartEventHandlers } from '../types';

interface Props extends ChartEventHandlers {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

type Mapped = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [Property in keyof ChartEventHandlers]: any;
};

const keyIsSupported = (key: string): key is keyof ChartEventHandlers => {
  const handlerKey = key as typeof SUPPORTED_EVENTS[0];
  return SUPPORTED_EVENTS.includes(handlerKey);
};

/**
 * This function accepts an object which includes ChartEventHandlers, and returns
 * an object with all non-ChartEventHandler values filtered out.
 * It can optionally remap those handlers, for example to provide the React event
 * handler versions which will be directly attached to SVG elements.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default <T>(props: Props, map?: (handler: ChartEventHandler) => T) => {
  return Object.keys(props).reduce((acc, key) => {
    if (key.startsWith('__')) return acc;

    if (typeof props[key] === 'undefined') return acc;

    if (keyIsSupported(key)) {
      acc[key] = map ? map(props[key] as ChartEventHandler) : props[key];
      return acc;
    }

    return acc;
  }, {} as Mapped);
};
