import React, { useCallback, useContext, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { ChartContext } from './Chart';
import Line from './Line';

interface Props {
  data: [number, number][];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

const Shape: React.FC<Props> = (props) => {
  const { data } = props;
  const { cartesianBox, pxBox } = useContext(ChartContext);

  const convertX = useCallback(
    (coord: number) =>
      scaleLinear().domain(cartesianBox.x).range(pxBox.x)(coord),
    [cartesianBox, pxBox]
  );
  const convertY = useCallback(
    (coord: number) =>
      scaleLinear().domain(cartesianBox.y).range(pxBox.y.reverse())(coord),
    [cartesianBox, pxBox]
  );

  const pxData = data.map(
    (point) => [convertX(point[0]), convertY(point[1])] as [number, number]
  );

  return <Line path={pxData} {...props} />;
};

export default Shape;
