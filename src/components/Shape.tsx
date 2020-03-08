import React, { useContext, useEffect } from 'react';
import { line as d3Line } from 'd3-shape';
import { ScapeContext } from './Reactscape';

const Shape: React.FC<{}> = () => {
  const { renderer, useCanvas, pxScale } = useContext(ScapeContext);

  const data: Array<[number, number]> = [
    [150, 0],
    [75, 200],
    [225, 200],
  ];

  useEffect(() => {
    if (renderer) {
      const line = d3Line().context(renderer);
      renderer.beginPath();
      renderer.fillStyle = '#000';
      renderer.strokeStyle = '#000';
      line(data);
      renderer.fill();
      renderer.stroke();
    }
  });

  if (useCanvas) {
    return null;
  }

  const line = d3Line()(data);
  if (!line) return null;
  return <path d={line} />;
};

export default Shape;
