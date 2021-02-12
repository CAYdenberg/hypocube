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
import React, { useEffect } from 'react';
import useChartState from '../base/ChartState';

export type symbolType =
  | 'circle'
  | 'cross'
  | 'diamond'
  | 'square'
  | 'star'
  | 'triangle'
  | 'wye';

interface SymbolProps {
  point: [number, number];
  size?: number;
  symbol?: D3SymbolType | symbolType;
  stroke?: string;
  fill?: string | null;
  strokeWidth?: number;
}

const getD3Symbol = (input: symbolType | D3SymbolType): D3SymbolType => {
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
  }

  return symbolCircle;
};

export const Symbol: React.FC<SymbolProps> = props => {
  const { point, size, symbol, stroke, fill, strokeWidth } = {
    size: 8,
    symbol: symbolCircle,
    stroke: '#000',
    strokeWidth: 1,
    fill: null,
    ...props,
  };
  const symbolF = getD3Symbol(symbol);

  const { scaleX, scaleY, renderer, isCanvas } = useChartState();

  const pxPoint: [number, number] = [scaleX(point[0]), scaleY(point[1])];

  useEffect(() => {
    if (renderer) {
      const line = d3Symbol(symbolF, size * 8).context(renderer);

      renderer.setTransform(1, 0, 0, 1, ...pxPoint);
      renderer.beginPath();
      renderer.strokeStyle = stroke;
      renderer.lineWidth = strokeWidth;

      line();
      renderer.stroke();

      if (fill) {
        renderer.fillStyle = fill;
        renderer.fill();
      }

      renderer.restore();
      renderer.setTransform(1, 0, 0, 1, 0, 0);
    }
  });

  if (isCanvas) return null;
  const line = d3Symbol(symbolF, size * 8)();
  if (!line) return null;

  return (
    <g transform={`translate(${pxPoint[0]}, ${pxPoint[1]})`}>
      <path
        d={line}
        stroke={stroke}
        fill={fill || 'transparent'}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};
