import { scaleLinear } from 'd3-scale';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Scale, ChartState } from '../types';

export const ChartContext = React.createContext<ChartState>({
  isCanvas: false,
  cartesianBox: { x: [0, 1], y: [0, 1] },
  pxBox: { x: [0, 1], y: [0, 1] },
  scaleX: scaleLinear(),
  scaleY: scaleLinear(),
  renderer: null,
  containerOffset: [0, 0],
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
  const renderer = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    renderer.current = canvasEl ? canvasEl.getContext('2d') : null;
  }, [canvasRef]);

  const [pxBox, setPxBox] = useState<Scale>({
    x: [0, 1],
    y: [0, 1],
  });

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

  const cartesianBox = view;
  const scaleX = scaleLinear().domain(cartesianBox.x).range(pxBox.x);
  const scaleY = scaleLinear()
    .domain(cartesianBox.y)
    .range([pxBox.y[1], pxBox.y[0]]);
  const containerOffset: [number, number] = containerRef.current
    ? [containerRef.current.offsetLeft, containerRef.current.offsetTop]
    : [0, 0];

  if (renderer.current) {
    renderer.current.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);
  }

  return (
    <ChartContext.Provider
      value={{
        renderer: renderer.current,
        isCanvas,
        pxBox,
        cartesianBox,
        scaleX,
        scaleY,
        containerOffset,
      }}
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
