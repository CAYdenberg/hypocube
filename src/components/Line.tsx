import React, { useContext, useEffect } from 'react';
import { line as d3Line } from 'd3-shape';
import { ChartContext } from './Chart';

interface Props {
  path: [number, number][];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

const Line: React.FC<Props> = (props) => {
  const { path, stroke, fill, strokeWidth } = {
    stroke: '#000',
    fill: '#000',
    strokeWidth: 1,
    ...props,
  };

  const { renderer, isCanvas } = useContext(ChartContext);

  useEffect(() => {
    if (renderer) {
      const line = d3Line().context(renderer);
      renderer.beginPath();
      renderer.strokeStyle = stroke;
      renderer.fillStyle = fill;
      renderer.lineWidth = strokeWidth;
      line(path);
      renderer.fill();
      renderer.stroke();
    }
  });

  if (isCanvas) {
    return null;
  }

  const line = d3Line()(path);
  if (!line) {
    return null;
  }
  return (
    <path d={line} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />
  );
};

export default Line;
