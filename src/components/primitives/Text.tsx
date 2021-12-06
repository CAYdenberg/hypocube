import React from 'react';
import { DEFAULT_FONT_FAMILY } from '../../constants';
import { normalize } from '../../lib/normalize';
import { Point } from '../../types';
import useChartState from '../base/ChartState';
import { useClip } from './Clip';

export interface Props {
  position: Point;
  text: string;
  pxOffset?: [number, number];
  /**
   * Default: #000
   */
  color?: string;
  /**
   * Default: "Helvetica"
   */
  font?: string;
  /**
   * Default: 16
   */
  fontSize?: number;
  /**
   * Default: left
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Rotation of the text, in radians. 0 is horizontal ltr text,
   */
  rotation?: number;
  /**
   * When false, sets pointer-events: none as an inline style. Useful for
   * for restricting events to the underlying elements, especially the Chart
   * element. Default: true.
   */
  svgPointerEvents?: boolean;
}

const Text: React.FC<Props> = (props) => {
  const { scaleX, scaleY, pushToCanvasQueue, isCanvas } = useChartState();
  const clip = useClip();

  const { position, text } = props;

  const font = normalize(props.font, DEFAULT_FONT_FAMILY);
  const fontSize = normalize(props.fontSize, 16);
  const color = normalize(props.color, '#000');
  const align = normalize(props.align, 'left');
  const pxOffset = normalize(props.pxOffset, [0, 0]);
  const rotation = normalize(props.rotation, 0);
  const svgPointerEvents = normalize(props.svgPointerEvents, true);

  const x = scaleX(position[0]) + pxOffset[0];
  const y = scaleY(position[1]) + pxOffset[1];

  pushToCanvasQueue &&
    pushToCanvasQueue((renderer, dpr) => {
      clip(renderer, dpr);
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
      style={{
        fontFamily: font,
        pointerEvents: svgPointerEvents ? undefined : 'none',
        userSelect: 'none',
      }}
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
