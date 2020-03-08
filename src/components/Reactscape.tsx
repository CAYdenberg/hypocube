import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface Scale {
  x: [number, number];
  y: [number, number];
}

export interface Scape {
  useCanvas: boolean;
  renderer?: CanvasRenderingContext2D | null;
  scale: Scale;
}

export const ScapeContext = React.createContext<Scape>();

interface Props {
  useCanvas?: boolean | null;
  pxHeight: number;
}

const Reactscape: React.FC<Props> = ({ useCanvas, children, pxHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pxScale, setPxScale] = useState<Scale>({
    x: [0, 1],
    y: [0, 1],
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<CanvasRenderingContext2D | null>();

  const calculateScales = useCallback(() => {
    const containerEl = containerRef.current;
    if (containerEl) {
      setPxScale({
        x: [0, containerEl.clientWidth],
        y: [0, containerEl.clientHeight],
      });
    }
  }, [containerRef]);

  useEffect(() => {
    calculateScales();

    if (!window) return;
    window.addEventListener('resize', calculateScales);

    return () => {
      window.removeEventListener('resize', calculateScales);
    };
  }, [containerRef]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    setRenderer(canvasEl ? canvasEl.getContext('2d') : null);
  }, [canvasRef]);

  return (
    <ScapeContext.Provider value={{ renderer, useCanvas, pxScale }}>
      <div ref={containerRef} style={{ width: '100%', height: pxHeight }}>
        {useCanvas ? (
          <canvas ref={canvasRef} width={pxScale.x[1]} height={pxHeight}>
            {children}
          </canvas>
        ) : (
          <svg width={pxScale.x[1]} height={pxScale.y[1]}>
            {children}
          </svg>
        )}
      </div>
    </ScapeContext.Provider>
  );
};

export default Reactscape;
