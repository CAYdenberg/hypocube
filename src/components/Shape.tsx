import React, { useContext } from 'react';
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
  const { scaleX, scaleY } = useContext(ChartContext);

  const pxData = data.map(
    (point) => [scaleX(point[0]), scaleY(point[1])] as [number, number]
  );

  return <Line path={pxData} {...props} />;
};

export default Shape;
