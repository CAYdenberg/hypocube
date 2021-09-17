import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import Viewbox from './Viewbox';
import { WINDOW_RESIZE_RENDER_RATE } from '../constants';

export default (
  width: number,
  height: number | ((width: number) => number),
  ref: React.RefObject<HTMLDivElement>
): Viewbox => {
  const getHeight = useCallback(
    (width: number) => (typeof height === 'function' ? height(width) : height),
    [height]
  );

  const [pxBox, setPxBox] = useState<Viewbox>(
    new Viewbox(0, 0, width, getHeight(width))
  );

  const calculateSizes = useCallback(() => {
    const containerEl = ref.current;
    if (containerEl) {
      setPxBox(
        new Viewbox(
          0,
          0,
          containerEl.clientWidth,
          getHeight(containerEl.clientWidth)
        )
      );
    }
  }, [ref, getHeight]);

  useEffect(() => {
    calculateSizes();

    if (!window) {
      return;
    }
    const debouncedCalculateSizes = debounce(
      calculateSizes,
      WINDOW_RESIZE_RENDER_RATE,
      {
        leading: true,
        trailing: true,
      }
    );

    window.addEventListener('resize', debouncedCalculateSizes);
    return () => {
      window.removeEventListener('resize', debouncedCalculateSizes);
    };
  }, [ref, calculateSizes]);

  return pxBox;
};
