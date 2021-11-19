import { scaleLinear } from 'd3-scale';
import React, { useRef, useMemo } from 'react';
import { normalize } from '../../lib/normalize';
import selectHandlers from '../../lib/selectHandlers';
import useCanvas from '../../lib/useCanvas';
import useContainerSizes from '../../lib/useContainerSizes';
import { HandlerProps } from '../../lib/useHandle';
import Viewbox, { createViewbox, ViewboxDuck } from '../../api/Viewbox';
import { ChartGestureData, ChartStyleOptions, Point } from '../../types';
import { ChartHandle } from '../primitives/Handle';
import ChartError from './ChartError';
import { ChartStateContext } from './ChartState';
import { ChartStyleProvider } from './ChartStyle';

interface HtmlLayerElement {
  position: Point;
  render: JSX.Element | null;
}

export interface Props extends HandlerProps {
  /**
   * The coordinates of the box containing the visible portion of the chart data.
   * Given as an array in the form: [x minimum, y minimum, width, height] on
   * the Cartesian scale.
   */
  view: ViewboxDuck | ((width: number) => ViewboxDuck);
  /**
   * CSS max-width value.
   */
  maxWidth?: number | string;
  /**
   * Initial rendered width in pixels. Immediately after rendering,
   * the chart will automatically adjust to the width of its container.
   */
  ssWidth?: number;
  /**
   * Rendered height in pixels. If a function is given, the height
   * will be calculated from the rendered width.
   */
  height?: number | ((width: number) => number);
  /**
   * Extra padding (given in pixels) added to each side of the chart. This is
   * useful for ensuring that axes and other Chart decorations have enough space
   * for proper rendering regardless of the actual dimensions available. Given
   * in the form [top, right, bottom, left], on the pixel scale.
   */
  gutter?: [number, number, number, number];
  /**
   * When true, render with the canvas element, instead of SVG.
   */
  isCanvas?: boolean;
  /**
   * The global chart styles. See "the `ChartStyles` object" for more
   * information.
   */
  chartStyle?: ChartStyleOptions;
  /**
   * Event handler for drag, pinch, swipe, and wheel gestures. See "Interaction"
   * for more information.
   */
  onGesture?: (data: ChartGestureData) => void;
  /**
   * An element, or array of elements, to be rendered outside of SVG (or canvas).
   * The Given in the form { position: [x, y], render: React element }. Useful
   * for e.g. for tooltips.
   */
  htmlLayer?: HtmlLayerElement[] | HtmlLayerElement | null;
  /** A  React component which will be rendered in case of an error. The error
   * message, if any, is passed as a prop.
   */
  renderError?: React.FC<{ message?: string }>;
}

const ChartInner: React.FC<Props> = (props) => {
  const { children } = props;
  const isCanvas = normalize(props.isCanvas, false);
  const chartStyle = normalize(props.chartStyle, {});
  const gutter = normalize(props.gutter, [0, 0, 0, 0]);
  const ssWidth = normalize(props.ssWidth, 300);
  const height = normalize(props.height, 150);

  const containerRef = useRef<HTMLDivElement>(null);
  const pxBox = useContainerSizes(ssWidth, height, containerRef);

  const cartesianBox: Viewbox = createViewbox(
    typeof props.view === 'function' ? props.view(pxBox.width) : props.view
  );

  const scaleX = scaleLinear()
    .domain(cartesianBox.x)
    .range([pxBox.x[0] + gutter[3], pxBox.x[1] - gutter[1]]);
  const scaleY = scaleLinear()
    .domain(cartesianBox.y)
    .range([pxBox.y[1] - gutter[2], pxBox.y[0] + gutter[0]]);

  const { pushToCanvasQueue, onRenderCanvas } = useCanvas(pxBox, isCanvas);

  const chartState = useMemo(
    () => ({
      pushToCanvasQueue,
      isCanvas,
      pxBox,
      cartesianBox,
      scaleX,
      scaleY,
      container: containerRef,
    }),
    // viewboxes use a hash to optimize re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pushToCanvasQueue, pxBox, cartesianBox.hash]
  );

  const htmlLayer: HtmlLayerElement[] = Array.isArray(props.htmlLayer)
    ? props.htmlLayer
    : props.htmlLayer
    ? [props.htmlLayer]
    : [];

  return (
    <div
      ref={containerRef}
      style={{
        height: pxBox.height,
        position: 'relative',
        maxWidth: props.maxWidth,
      }}
    >
      <ChartStateContext.Provider value={chartState}>
        <ChartStyleProvider chartStyle={chartStyle}>
          <ChartHandle
            onGesture={props.onGesture}
            containerNode={containerRef}
            {...selectHandlers(props)}
          >
            {isCanvas ? (
              <canvas
                ref={onRenderCanvas}
                width={pxBox.width}
                height={pxBox.height}
              >
                {children}
              </canvas>
            ) : (
              <svg width={pxBox.width} height={pxBox.height}>
                {children}
              </svg>
            )}
            {htmlLayer.map((layer) => (
              <div
                style={{
                  position: 'absolute',
                  left: scaleX(layer.position[0]),
                  top: scaleY(layer.position[1]),
                }}
                key={`${layer.position[0]}-${layer.position[1]}`}
              >
                {layer.render}
              </div>
            ))}
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
      const CustomError = this.props.renderError;
      return <CustomError message={this.state.errorMessage} />;
    } else if (this.state.hasError) {
      return <ChartError {...this.props} />;
    }

    return <ChartInner {...this.props} />;
  }
}

export default Chart;
