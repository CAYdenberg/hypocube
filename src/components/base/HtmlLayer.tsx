import React from 'react';
import { Point } from '../../types';
import useChartState from './ChartState';
import { useChartStyle } from './ChartStyle';

export interface HtmlLayerElement {
  position: Point;
  render: JSX.Element | null;
}

interface Props {
  htmlLayer?: HtmlLayerElement[] | HtmlLayerElement | null;
}

export const HtmlLayerManager: React.FC<Props> = (props) => {
  const { scaleX, scaleY } = useChartState();
  const { htmlLayerPointerEvents } = useChartStyle();

  const htmlLayer: HtmlLayerElement[] = Array.isArray(props.htmlLayer)
    ? props.htmlLayer
    : props.htmlLayer
    ? [props.htmlLayer]
    : [];

  return (
    <React.Fragment>
      {htmlLayer.map((layer) => (
        <div
          style={{
            position: 'absolute',
            left: scaleX(layer.position[0]),
            top: scaleY(layer.position[1]),
            pointerEvents: htmlLayerPointerEvents ? undefined : 'none',
          }}
          key={`${layer.position[0]}-${layer.position[1]}`}
        >
          {layer.render}
        </div>
      ))}
    </React.Fragment>
  );
};
