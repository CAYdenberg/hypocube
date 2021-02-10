import React, { useEffect } from 'react';
import { normalize } from '../../lib/normalize';
import { Point } from '../../types';
import useChartState from '../base/ChartState';

export interface TextDrawProps {
  pxOffset?: [number, number];
  color?: string;
  font?: string;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
}

interface Props extends TextDrawProps {
  position: Point;
  text: string;
}

const Text: React.FC<Props> = (props) => {
  const { scaleX, scaleY, renderer, isCanvas } = useChartState();
  const { position, text } = props;

  const font = normalize(props.font, 'Helvetica');
  const fontSize = normalize(props.fontSize, 16);
  const color = normalize(props.color, '#000');
  const align = normalize(props.align, 'left');
  const pxOffset = normalize(props.pxOffset, [0, 0]);

  const x = scaleX(position[0]) + pxOffset[0];
  const y = scaleY(position[1]) + pxOffset[1];

  useEffect(() => {
    if (renderer) {
      renderer.font = `${fontSize}px ${font}`;
      renderer.textAlign = align;
      renderer.fillStyle = color;
      renderer.fillText(text, x, y);
    }
  });
  if (isCanvas) {
    return null;
  }

  const svgAnchor =
    align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';

  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={fontSize}
      style={{ fontFamily: `${font}, sans-serif` }}
      textAnchor={svgAnchor}
    >
      {text}
    </text>
  );
};

export default Text;
