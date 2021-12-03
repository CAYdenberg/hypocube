import React, { useContext, useMemo } from 'react';
import { line as d3Line } from 'd3-shape';
import { hashDatapoints } from '../../lib/hashDatapoints';
import { CanvasComponent, ClipT, Point } from '../../types';
import useChartState from '../base/ChartState';

export const ChartClipContext = React.createContext<ClipT | null>(null);

const useClip = (): ClipT | null => {
  const existing = useContext(ChartClipContext);
  return existing || null;
};

interface Props {
  path?: Point[] | null;
}

const Clip: React.FC<Props> = ({ path, children }) => {
  const { scaleX, scaleY, isCanvas } = useChartState();
  const prev = useClip();

  const value = useMemo((): ClipT | null => {
    const pxPath = path
      ? path.map((point) => [scaleX(point[0]), scaleY(point[1])] as Point)
      : [];

    const svgPath = d3Line()(pxPath);
    const id = pxPath.length ? hashDatapoints(pxPath) : '';

    if (!svgPath) {
      return null;
    }

    const render: CanvasComponent = (renderer, dpr) => {
      prev && prev.render(renderer, dpr);
      if (!pxPath.length) return;
      renderer.beginPath();
      d3Line().context(renderer)(pxPath);
      renderer.clip('nonzero');
    };

    return {
      svgPath,
      id,
      render,
    };
  }, [prev, path, scaleX, scaleY]);

  if (!value) {
    return <React.Fragment>{children}</React.Fragment>;
  } else if (isCanvas) {
    return (
      <ChartClipContext.Provider value={value}>
        {children}
      </ChartClipContext.Provider>
    );
  }

  const { id, svgPath } = value;

  return (
    <ChartClipContext.Provider value={value}>
      <defs>
        <clipPath id={id} clipRule="nonzero">
          <path d={svgPath} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </ChartClipContext.Provider>
  );
};

export default Clip;
