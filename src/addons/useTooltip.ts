import { useCallback, useRef, useState } from 'react';
import { HypocubeEventData, Point } from '../types';

interface TooltipData {
  position: Point;
  meta: Record<string, string | number | null>;
}

export default () => {
  const [data, setData] = useState<TooltipData | null>(null);
  const ref = useRef();

  const handleSetTooltip = useCallback((data: HypocubeEventData) => {
    // set tooltip
  }, []);

  // clear on click outside

  return {
    ref,
    data,
    handleSetTooltip,
  };
};
