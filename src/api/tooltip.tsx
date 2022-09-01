import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChartEvent, ChartEventMetaData, Point } from '../types';

interface TooltipData<Meta extends ChartEventMetaData> {
  position: Point;
  meta: Meta;
}

export const useTooltip = <Meta extends ChartEventMetaData>() => {
  const [data, setData] = useState<TooltipData<Meta> | null>(null);

  const handleSetTooltip = useCallback(
    ({ elementPosition, meta }: ChartEvent) => {
      if (!elementPosition) {
        return;
      }
      setData({
        position: elementPosition,
        meta: meta as Meta,
      });
    },
    []
  );

  const handleCloseTooltip = useCallback(() => setData(null), []);

  return [data, handleSetTooltip, handleCloseTooltip] as const;
};

export const TooltipWrapper: React.FC<{
  onRequestClose: () => void;
  children: React.ReactNode;
}> = ({ onRequestClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        onRequestClose();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [onRequestClose]);

  return (
    <div ref={ref} role="tooltip" aria-live="polite">
      {children}
    </div>
  );
};
