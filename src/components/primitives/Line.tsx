import React, { useEffect } from 'react';
import { line as d3Line } from 'd3-shape';

import { Point } from '../../types';
import useChartState from '../base/ChartState';

interface Props {
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  path: Point[];
}

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
  const { path, stroke, fill, strokeWidth } = {
    stroke: '#000',
    strokeWidth: 1,
    fill: null,
    ...props,
  };

  const { renderer, isCanvas } = useChartState();

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
