import { scaleLinear } from 'd3-scale';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { normalize } from '../../lib/normalize';
import useCanvas from '../../lib/useCanvas';
import { HandlerProps } from '../../lib/useHandle';
import Viewbox, { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import { ChartStyleOptions, Point } from '../../types';
import { ChartHandle } from '../primitives/Handle';
import { ChartStateContext } from './ChartState';
import { ChartStyleProvider } from './ChartStyle';

interface Props extends HandlerProps {
  height: number;
  width: number;
  view: ViewboxDuck | ((width: number) => ViewboxDuck);
  /**
   * An additional number of pixels added to each side of the graph, specified as [top, right, bottom, left]
   */
  gutter?: [number, number, number, number];
  isCanvas?: boolean;
  chartStyle?: ChartStyleOptions;
  tooltip?: JSX.Element | null;
  tooltipPosition?: Point | null;
}

const Chart: React.FC<Props> = (props) => {
  const { children, height, width } = props;
  const isCanvas = normalize(props.isCanvas, false);
  const chartStyle = normalize(props.chartStyle, {});
  const gutter = normalize(props.gutter, [0, 0, 0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [pxBox, setPxBox] = useState<Viewbox>(new Viewbox(0, 0, width, height));

  const calculateSizes = useCallback(() => {
    const containerEl = containerRef.current;
    if (containerEl) {
      setPxBox(
        new Viewbox(0, 0, containerEl.clientWidth, containerEl.clientHeight)
      );
    }
  }, [containerRef]);

  useEffect(() => {
    calculateSizes();

    if (!window) {
      return;
    }
    window.addEventListener('resize', calculateSizes);

    return () => {
      window.removeEventListener('resize', calculateSizes);
    };
  }, [containerRef, calculateSizes]);

  const cartesianBox: Viewbox = createViewbox(
    typeof props.view === 'function' ? props.view(width) : props.view
  );

  const scaleX = useMemo(
    () =>
      scaleLinear()
        .domain(cartesianBox.x)
        .range([pxBox.x[0] + gutter[3], pxBox.x[1] - gutter[1]]),
    [pxBox, cartesianBox]
  );
  const scaleY = useMemo(
    () =>
      scaleLinear()
        .domain(cartesianBox.y)
        .range([pxBox.y[1] - gutter[2], pxBox.y[0] + gutter[0]]),
    [pxBox, cartesianBox]
  );
  const containerOffset: [number, number] = containerRef.current
    ? [containerRef.current.offsetLeft, containerRef.current.offsetTop]
    : [0, 0];

  const { pushToCanvasQueue, canvasRef } = useCanvas(pxBox, children);

  return (
    <ChartStateContext.Provider
      value={{
        pushToCanvasQueue,
        isCanvas,
        pxBox,
        cartesianBox,
        scaleX,
        scaleY,
        containerOffset,
      }}
    >
      <ChartStyleProvider chartStyle={chartStyle}>
        <div
          ref={containerRef}
          style={{
            height,
            maxWidth: width,
            minWidth: '100%',
            position: 'relative',
          }}
        >
          <ChartHandle {...props}>
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
          </ChartHandle>
        </div>
      </ChartStyleProvider>
    </ChartStateContext.Provider>
  );
};

export default Chart;
