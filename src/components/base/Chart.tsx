import { scaleLinear } from 'd3-scale';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { normalize } from '../../lib/normalize';
import selectHandlers from '../../lib/selectHandlers';
import useCanvas from '../../lib/useCanvas';
import { HandlerProps } from '../../lib/useHandle';
import Viewbox, { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import { ChartGestureData, ChartStyleOptions, Point } from '../../types';
import { ChartHandle } from '../primitives/Handle';
import ChartError from './ChartError';
import { ChartStateContext } from './ChartState';
import { ChartStyleProvider } from './ChartStyle';

export interface Props extends HandlerProps {
  /**
   * (required) Initial rendered width in pixels. Immediately after rendering,
   * the chart will automatically adjust to the width of its container.
   */
  width: number;
  /**
   * (required) Rendered height in pixels. If a function is given, the height
   * will be calculated from the rendered width.
   */
  height: number | ((width: number) => number);
  view: ViewboxDuck | ((width: number) => ViewboxDuck);
  gutter?: [number, number, number, number];
  isCanvas?: boolean;
  chartStyle?: ChartStyleOptions;
  onGesture?: (data: ChartGestureData) => void;
  htmlLayer?: {
    position: Point;
    render: JSX.Element | null;
  } | null;
  renderError?: (message?: string) => React.ReactNode;
}

const ChartInner: React.FC<Props> = (props) => {
  const { children } = props;
  const isCanvas = normalize(props.isCanvas, false);
  const chartStyle = normalize(props.chartStyle, {});
  const gutter = normalize(props.gutter, [0, 0, 0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);

  const getHeight = useCallback(
    (width: number) =>
      typeof props.height === 'function' ? props.height(width) : props.height,
    [props.height]
  );

  const [pxBox, setPxBox] = useState<Viewbox>(
    new Viewbox(0, 0, props.width, getHeight(props.width))
  );

  const calculateSizes = useCallback(() => {
    const containerEl = containerRef.current;
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
    typeof props.view === 'function' ? props.view(props.width) : props.view
  );

  const scaleX = scaleLinear()
    .domain(cartesianBox.x)
    .range([pxBox.x[0] + gutter[3], pxBox.x[1] - gutter[1]]);
  const scaleY = scaleLinear()
    .domain(cartesianBox.y)
    .range([pxBox.y[1] - gutter[2], pxBox.y[0] + gutter[0]]);

  const containerOffset: [number, number] = containerRef.current
    ? [containerRef.current.offsetLeft, containerRef.current.offsetTop]
    : [0, 0];

  const { pushToCanvasQueue, canvasRef } = useCanvas(pxBox, isCanvas);

  const chartState = useMemo(
    () => ({
      pushToCanvasQueue,
      isCanvas,
      pxBox,
      cartesianBox,
      scaleX,
      scaleY,
      containerOffset,
    }),
    [isCanvas, pxBox, props.view]
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: pxBox.height,
        maxWidth: pxBox.width,
        minWidth: '100%',
        position: 'relative',
      }}
    >
      <ChartStateContext.Provider value={chartState}>
        <ChartStyleProvider chartStyle={chartStyle}>
          <ChartHandle onGesture={props.onGesture} {...selectHandlers(props)}>
            {isCanvas ? (
              <canvas ref={canvasRef} width={pxBox.width} height={pxBox.height}>
                {children}
              </canvas>
            ) : (
              <svg width={pxBox.width} height={pxBox.height}>
                {children}
              </svg>
            )}
            {props.htmlLayer ? (
              <div
                style={{
                  position: 'absolute',
                  left: scaleX(props.htmlLayer.position[0]),
                  top: scaleY(props.htmlLayer.position[1]),
                }}
              >
                {props.htmlLayer.render}
              </div>
            ) : null}
          </ChartHandle>
        </ChartStyleProvider>
      </ChartStateContext.Provider>
    </div>
  );
};

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * The base component for Hypocube charts.
 */
class Chart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.warn('Error while rendering Hypocube chart', error);
  }

  render() {
    if (this.state.hasError && this.props.renderError) {
      return this.props.renderError(this.state.errorMessage);
    } else if (this.state.hasError) {
      return <ChartError {...this.props} />;
    }

    return <ChartInner {...this.props} />;
  }
}

export default Chart;
