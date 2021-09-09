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
import useChartState from '../base/ChartState';

export type symbolType =
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
  size?: number;
  symbol?: D3SymbolType | symbolType;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  quietRenderRadius?: number;
}

const getD3Symbol = (input: symbolType | D3SymbolType): D3SymbolType | null => {
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

export const Symbol: React.FC<SymbolProps> = (props) => {
  const {
    point,
    size,
    symbol,
    stroke,
    fill,
    strokeWidth,
    quietRenderRadius,
  } = {
    size: 5,
    symbol: symbolCircle,
    stroke: '#000',
    strokeWidth: 1,
    fill: null,
    quietRenderRadius: 0,
    ...props,
  };
  const symbolF = getD3Symbol(symbol);

  if (!symbolF) {
    return null;
  }

  const { scaleX, scaleY, pushToCanvasQueue, isCanvas } = useChartState();

  const pxPoint: [number, number] = [scaleX(point[0]), scaleY(point[1])];

  pushToCanvasQueue &&
    pushToCanvasQueue((renderer) => {
      const line = d3Symbol(symbolF, size * 8).context(renderer);

      renderer.setTransform(1, 0, 0, 1, ...pxPoint);
      renderer.beginPath();

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
    <g transform={`translate(${pxPoint[0]}, ${pxPoint[1]})`}>
      <circle r={quietRenderRadius} x={0} y={0} fill="transparent"></circle>
      <path
        d={line}
        stroke={stroke}
        fill={fill || 'transparent'}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};
