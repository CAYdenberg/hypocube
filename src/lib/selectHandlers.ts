import { SUPPORTED_EVENTS } from '../constants';
import { ChartEventHandler, ChartEventHandlers } from '../types';

interface Props extends ChartEventHandlers {
  [key: string]: any;
}

type Mapped = {
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
export default (props: Props, map?: (handler: ChartEventHandler) => any) => {
  return Object.keys(props).reduce((acc, key) => {
    if (typeof props[key] === 'undefined') return acc;

    if (keyIsSupported(key)) {
      acc[key] = map ? map(props[key] as ChartEventHandler) : props[key];
      return acc;
    }

    return acc;
  }, {} as Mapped);
};
