import React, { useMemo } from 'react';
import { line as d3Line } from 'd3-shape';
import { hashDatapoints } from '../../lib/hashDatapoints';
import { CanvasComponent, ClipT, Point } from '../../types';
import useChartState from '../base/ChartState';

export const ChartClipContext = React.createContext<ClipT | null>(null);

interface Props {
  path?: Point[] | null;
}

const Clip: React.FC<Props> = ({ path, children }) => {
  const { scaleX, scaleY, isCanvas } = useChartState();

  const { svgPath, id, render } = useMemo(() => {
    const pxPath = path
      ? path.map((point) => [scaleX(point[0]), scaleY(point[1])] as Point)
      : [];
    const id = pxPath.length ? hashDatapoints(pxPath) : '';
    const svgPath = d3Line()(pxPath);

    const render: CanvasComponent = (renderer) => {
      if (!pxPath.length) return;
      renderer.beginPath();
      d3Line().context(renderer)(pxPath);
      renderer.clip();
    };

    return {
      svgPath,
      id,
      render,
    };
  }, [path, scaleX, scaleY]);

  if (!path || !path.length) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <ChartClipContext.Provider value={id ? { render, id } : null}>
      {id && svgPath && !isCanvas ? (
        <clipPath id={id}>
          <path d={svgPath} />
        </clipPath>
      ) : null}
      {children}
    </ChartClipContext.Provider>
  );
};

export default Clip;
