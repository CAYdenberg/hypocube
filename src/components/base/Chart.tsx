import { scaleLinear } from 'd3-scale';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { normalize } from '../../lib/normalize';
import { ChartStyleOptions, Point, Viewbox } from '../../types';
import { ChartStateContext } from './ChartState';
import { ChartStyleProvider } from './ChartStyle';

interface Props {
  height: number;
  view: Viewbox;
  gutter?: [number, number, number, number];
  isCanvas?: boolean;
  rootStyles?: ChartStyleOptions;
  tooltip?: JSX.Element;
  tooltipPosition?: Point;
}

const Chart: React.FC<Props> = (props) => {
  const { children, height, view } = props;
  const isCanvas = normalize(props.isCanvas, false);
  const rootStyles = normalize(props.rootStyles, {});
  const gutter = normalize(props.gutter, [0, 0, 0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    renderer.current = canvasEl ? canvasEl.getContext('2d') : null;
  }, [canvasRef]);

  const [pxBox, setPxBox] = useState<Viewbox>({
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
  const scaleX = scaleLinear()
    .domain(cartesianBox.x)
    .range([pxBox.x[0] + gutter[3], pxBox.x[1] - gutter[1]]);
  const scaleY = scaleLinear()
    .domain(cartesianBox.y)
    .range([pxBox.y[1] - gutter[2], pxBox.y[0] + gutter[0]]);
  const containerOffset: [number, number] = containerRef.current
    ? [containerRef.current.offsetLeft, containerRef.current.offsetTop]
    : [0, 0];

  if (renderer.current) {
    renderer.current.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);
  }

  return (
    <ChartStateContext.Provider
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
      <ChartStyleProvider rootStyles={rootStyles}>
        <div
          ref={containerRef}
          style={{ width: '100%', height, position: 'relative' }}
        >
          {isCanvas ? (
            <canvas ref={canvasRef} width={pxBox.x[1]} height={height}>
              {children}
            </canvas>
          ) : (
            <svg width={pxBox.x[1]} height={pxBox.y[1]}>
              {children}
            </svg>
          )}
          {props.tooltip && props.tooltipPosition ? (
            <div
              style={{
                position: 'absolute',
                left: scaleX(props.tooltipPosition[0]),
                top: scaleY(props.tooltipPosition[1]),
              }}
            >
              {props.tooltip}
            </div>
          ) : null}
        </div>
      </ChartStyleProvider>
    </ChartStateContext.Provider>
  );
};

export default Chart;
