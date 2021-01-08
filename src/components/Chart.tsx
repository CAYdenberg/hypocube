import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface Scale {
  x: [number, number];
  y: [number, number];
}

export interface ChartState {
  isCanvas: boolean;
  cartesianBox: Scale;
  pxBox: Scale;
  renderer?: CanvasRenderingContext2D | null;
}

export const ChartContext = React.createContext<ChartState>({
  isCanvas: false,
  cartesianBox: { x: [0, 1], y: [0, 1] },
  pxBox: { x: [0, 1], y: [0, 1] },
  renderer: null,
});

interface Props {
  height: number;
  isCanvas?: boolean;
  view: Scale;
}

const Chart: React.FC<Props> = ({
  isCanvas: _isCanvas,
  children,
  height,
  view,
}) => {
  const isCanvas = _isCanvas || false;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pxBox, setPxBox] = useState<Scale>({
    x: [0, 1],
    y: [0, 1],
  });
  const [renderer, setRenderer] = useState<CanvasRenderingContext2D | null>();

  const calculateScales = useCallback(() => {
    const containerEl = containerRef.current;
    if (containerEl) {
      setPxBox({
        x: [0, containerEl.clientWidth],
        y: [0, containerEl.clientHeight],
      });
    }
  }, [containerRef]);

  useEffect(() => {
    calculateScales();

    if (!window) {
      return;
    }
    window.addEventListener('resize', calculateScales);

    return () => {
      window.removeEventListener('resize', calculateScales);
    };
  }, [containerRef, calculateScales]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    setRenderer(canvasEl ? canvasEl.getContext('2d') : null);
  }, [canvasRef]);

  return (
    <ChartContext.Provider
      value={{ renderer, isCanvas, pxBox, cartesianBox: view }}
    >
      <div ref={containerRef} style={{ width: '100%', height }}>
        {isCanvas ? (
          <canvas ref={canvasRef} width={pxBox.x[1]} height={height}>
            {children}
          </canvas>
        ) : (
          <svg width={pxBox.x[1]} height={pxBox.y[1]}>
            {children}
          </svg>
        )}
      </div>
    </ChartContext.Provider>
  );
};

export default Chart;
