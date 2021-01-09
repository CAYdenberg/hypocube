import React, { useContext, useEffect } from 'react';
import { line as d3Line } from 'd3-shape';

import { Point } from '../../types';
import { ChartContext } from '../Chart';

interface Props {
  path: Point[];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

export const Line: React.FC<Props> = (props) => {
  const { path } = props;
  const { scaleX, scaleY } = useContext(ChartContext);

  const pxData = path.map(
    (point) => [scaleX(point[0]), scaleY(point[1])] as [number, number]
  );

  return <PxLine {...props} path={pxData} />;
};

export const PxLine: React.FC<Props> = (props) => {
  const { path, stroke, fill, strokeWidth } = {
    stroke: '#000',
    strokeWidth: 1,
    fill: null,
    ...props,
  };

  const { renderer, isCanvas } = useContext(ChartContext);

  useEffect(() => {
    if (renderer) {
      const line = d3Line().context(renderer);
      renderer.beginPath();
      renderer.strokeStyle = stroke;

      renderer.lineWidth = strokeWidth;
      line(path);
      renderer.stroke();

      if (fill) {
        renderer.fillStyle = fill;
        renderer.fill();
      }
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
    <path
      d={line}
      stroke={stroke}
      fill={fill || 'transparent'}
      strokeWidth={strokeWidth}
    />
  );
};
