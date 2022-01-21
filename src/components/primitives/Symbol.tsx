import {
  symbol as d3Symbol,
  SymbolType as D3SymbolType,
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} from 'd3-shape';
import React from 'react';
import { radiansToDegrees } from '../../lib/geometry';
import useChartState from '../base/ChartState';
import { useClip } from './Clip';

export type SymbolType =
  | 'circle'
  | 'cross'
  | 'diamond'
  | 'square'
  | 'star'
  | 'triangle'
  | 'wye'
  | 'none';

interface SymbolProps {
  point: [number, number];
  /**
   * Default: 5
   */
  size?: number;
  /**
   * Default: "circle"
   */
  symbol?: D3SymbolType | SymbolType;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  rotation?: number;
  opacity?: number;
  /**
   * When rendering as SVG, an invisible circle of the given radius is rendered
   * around the symbol. This can help with interaction, ensuring the symbol is
   * clickable even when the actual symbol drawn is very small.
   */
  quietRenderRadius?: number;
  /**
   * When false, sets pointer-events: none as an inline style. Useful for
   * for restricting events to the underlying elements, especially the Chart
   * element. Default: true.
   */
  svgPointerEvents?: boolean;
}

const getD3Symbol = (input: SymbolType | D3SymbolType): D3SymbolType | null => {
  if (typeof input !== 'string') {
    return input;
  }

  switch (input) {
    case 'cross':
      return symbolCross;

    case 'diamond':
      return symbolDiamond;

    case 'square':
      return symbolSquare;

    case 'star':
      return symbolStar;

    case 'triangle':
      return symbolTriangle;

    case 'wye':
      return symbolWye;

    case 'none':
      return null;
  }

  return symbolCircle;
};

const Symbol: React.FC<SymbolProps> = (props) => {
  const {
    point,
    size,
    symbol,
    stroke,
    fill,
    strokeWidth,
    rotation,
    opacity,
    quietRenderRadius,
    svgPointerEvents,
  } = {
    size: 5,
    symbol: symbolCircle,
    stroke: '#000',
    strokeWidth: 1,
    rotation: 0,
    fill: null,
    opacity: 1,
    quietRenderRadius: 0,
    svgPointerEvents: true,
    ...props,
  };
  const { scaleX, scaleY, pushToCanvasQueue, isCanvas } = useChartState();
  const clip = useClip();

  const symbolF = getD3Symbol(symbol);
  if (!symbolF) {
    return null;
  }

  const pxPoint: [number, number] = [scaleX(point[0]), scaleY(point[1])];

  pushToCanvasQueue &&
    pushToCanvasQueue((renderer, dpr) => {
      clip(renderer, dpr);
      const line = d3Symbol(symbolF, size * 8).context(renderer);

      renderer.setTransform(dpr, 0, 0, dpr, pxPoint[0] * dpr, pxPoint[1] * dpr);
      renderer.rotate(rotation);
      renderer.beginPath();

      renderer.globalAlpha = opacity;

      line();

      if (stroke && strokeWidth) {
        renderer.strokeStyle = stroke;
        renderer.lineWidth = strokeWidth;
        renderer.stroke();
      }

      if (fill) {
        renderer.fillStyle = fill;
        renderer.fill();
      }
    });

  if (isCanvas) return null;
  const line = d3Symbol(symbolF, size * 8)();
  if (!line) return null;

  return (
    <g
      style={{ pointerEvents: svgPointerEvents ? undefined : 'none' }}
      transform={`translate(${pxPoint[0]}, ${
        pxPoint[1]
      }), rotate(${radiansToDegrees(rotation)})`}
    >
      <circle r={quietRenderRadius} x={0} y={0} fill="transparent"></circle>
      <path
        d={line}
        stroke={stroke}
        fill={fill || 'transparent'}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </g>
  );
};

export default Symbol;
