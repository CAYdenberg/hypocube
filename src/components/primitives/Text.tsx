import React from 'react';
import { normalize } from '../../lib/normalize';
import { Point } from '../../types';
import useChartState from '../base/ChartState';

export interface TextDrawProps {
  pxOffset?: [number, number];
  color?: string;
  font?: string;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  rotation?: number;
}

interface Props extends TextDrawProps {
  position: Point;
  text: string;
}

const Text: React.FC<Props> = (props) => {
  const { scaleX, scaleY, pushToCanvasQueue, isCanvas } = useChartState();
  const { position, text } = props;

  const font = normalize(props.font, 'Helvetica');
  const fontSize = normalize(props.fontSize, 16);
  const color = normalize(props.color, '#000');
  const align = normalize(props.align, 'left');
  const pxOffset = normalize(props.pxOffset, [0, 0]);
  const rotation = normalize(props.rotation, 0);

  const x = scaleX(position[0]) + pxOffset[0];
  const y = scaleY(position[1]) + pxOffset[1];

  pushToCanvasQueue &&
    pushToCanvasQueue((renderer) => {
      renderer.font = `${fontSize}px ${font}`;
      renderer.translate(x, y);
      renderer.rotate(rotation);
      renderer.textAlign = align;
      renderer.fillStyle = color;
      renderer.fillText(text, 0, 0);
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
      style={{ fontFamily: `${font}, sans-serif`, userSelect: 'none' }}
      textAnchor={svgAnchor}
      transform={
        rotation ? `rotate(${(rotation * 180) / Math.PI} ${x} ${y})` : undefined
      }
    >
      {text}
    </text>
  );
};

export default Text;
