import React from 'react';
import {
  curveBasisOpen,
  curveCardinalOpen,
  CurveFactoryLineOnly,
  curveLinear,
  curveNatural,
  curveStepBefore,
  line as d3Line,
} from 'd3-shape';
import { Point } from '../../types';
import useChartState from '../base/ChartState';
import { DASHED_LINE, DOTTED_LINE } from '../../constants';
import { useClip } from './Clip';

export type CurveType = 'linear' | 'cardinal' | 'natural' | 'basis' | 'step';
export type DashType = 'solid' | 'dashed' | 'dotted' | Array<number> | null;

interface Props {
  path: Point[];
  /**
   * Default: #000;
   */
  stroke?: string | null;
  /**
   * Default: null.
   */
  fill?: string | null;
  /**
   * Default: 1.
   */
  strokeWidth?: number;
  /**
   * Default: "linear"
   */
  curveType?: CurveType | CurveFactoryLineOnly;
  /**
   * Default: "solid"
   */
  dash?: DashType;
  /**
   * Opacity of both stroke and fill, ranging from 0 (fully transparent) to 1
   * (fully opaque). Default: 1.
   */
  opacity?: number;
  /**
   * When false, sets pointer-events: none as an inline style. Useful for
   * for restricting events to the underlying elements, especially the Chart
   * element. Default: true.
   */
  svgPointerEvents?: boolean;
}

const getD3Curve = (
  input: CurveType | CurveFactoryLineOnly
): CurveFactoryLineOnly => {
  if (typeof input !== 'string') return input;

  switch (input) {
    case 'cardinal':
      return curveCardinalOpen;

    case 'natural':
      return curveNatural;

    case 'basis':
      return curveBasisOpen;

    case 'step':
      return curveStepBefore;
  }

  return curveLinear;
};

const getDashArray = (input: DashType): Array<number> | null => {
  if (typeof input !== 'string') return input;

  switch (input) {
    case 'solid':
      return null;

    case 'dashed':
      return DASHED_LINE;

    case 'dotted':
      return DOTTED_LINE;
  }
};

export const Line: React.FC<Props> = (props) => {
  const { path } = props;
  const { scaleX, scaleY } = useChartState();

  const pxData = path.map(
    (point) => [scaleX(point[0]), scaleY(point[1])] as [number, number]
  );

  return <PxLine {...props} path={pxData} />;
};

export const TranslatedLine: React.FC<Props & { position: Point }> = (
  props
) => {
  const { path, position } = props;
  const { scaleX, scaleY } = useChartState();

  const pxPosition = [scaleX(position[0]), scaleY(position[1])] as Point;

  const pxData = path.map(
    (point) => [pxPosition[0] + point[0], pxPosition[1] + point[1]] as Point
  );

  return <PxLine {...props} path={pxData} />;
};

export const PxLine: React.FC<Props> = (props) => {
  const {
    path,
    stroke,
    fill,
    strokeWidth,
    curveType,
    dash,
    opacity,
    svgPointerEvents,
  } = {
    stroke: '#000',
    strokeWidth: 1,
    fill: null,
    curveType: 'linear' as CurveType,
    dash: null,
    opacity: 1,
    svgPointerEvents: true,
    ...props,
  };
  const curveFactory = getD3Curve(curveType);
  const dashArray = getDashArray(dash);

  const { pushToCanvasQueue, isCanvas } = useChartState();
  const clip = useClip();

  pushToCanvasQueue &&
    pushToCanvasQueue((renderer, dpr) => {
      clip(renderer, dpr);

      const line = d3Line()
        .curve(curveFactory)
        .context(renderer);
      renderer.beginPath();

      line(path);

      renderer.globalAlpha = opacity;

      if (stroke && strokeWidth) {
        renderer.strokeStyle = stroke;
        renderer.lineWidth = strokeWidth;

        if (dashArray) {
          renderer.setLineDash(dashArray);
        }

        renderer.stroke();
      }

      if (fill) {
        renderer.fillStyle = fill;
        renderer.fill();
      }
    });

  if (isCanvas) {
    return null;
  }

  const line = d3Line().curve(curveFactory)(path);
  if (!line) {
    return null;
  }

  return (
    <path
      d={line}
      stroke={stroke || 'transparent'}
      fill={fill || 'transparent'}
      strokeWidth={strokeWidth}
      strokeDasharray={dashArray ? dashArray.join(',') : undefined}
      opacity={opacity}
      style={{ pointerEvents: svgPointerEvents ? undefined : 'none' }}
    />
  );
};
