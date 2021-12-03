import React, { useContext, useMemo } from 'react';
import { line as d3Line } from 'd3-shape';
import { hashDatapoints } from '../../lib/hashDatapoints';
import { CanvasComponent, Point } from '../../types';
import useChartState from '../base/ChartState';

export const ClipRendererContext = React.createContext<CanvasComponent | null>(
  null
);

export const useClip = (): CanvasComponent => {
  const existing = useContext(ClipRendererContext);
  return existing || (() => undefined);
};

interface Props {
  path?: Point[] | null;
}

const Clip: React.FC<Props> = ({ path, children }) => {
  const { scaleX, scaleY, isCanvas } = useChartState();
  const prevRenderer = useClip();

  const clipData = useMemo(() => {
    const pxPath = path
      ? path.map((point) => [scaleX(point[0]), scaleY(point[1])] as Point)
      : [];

    const svgPath = d3Line()(pxPath);
    const id = pxPath.length ? hashDatapoints(pxPath) : '';

    if (!svgPath) {
      return null;
    }

    const render: CanvasComponent = (renderer, dpr) => {
      prevRenderer(renderer, dpr);
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
  }, [prevRenderer, path, scaleX, scaleY]);

  if (!clipData) {
    return <React.Fragment>{children}</React.Fragment>;
  } else if (isCanvas) {
    return (
      <ClipRendererContext.Provider value={clipData.render}>
        {children}
      </ClipRendererContext.Provider>
    );
  }

  const { id, svgPath } = clipData;

  return (
    <React.Fragment>
      <defs>
        <clipPath id={id} clipRule="nonzero">
          <path d={svgPath} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </React.Fragment>
  );
};

export default Clip;
