import React, { Fragment, useCallback } from 'react';
import useChartState from '../base/ChartState';
import { Event, Interaction } from '../../types';

interface Props {
  onClick?: (data: Interaction) => void;
  elementPosition: [number, number];
  meta?: {
    [key: string]: string | number | boolean;
  };
}

const Handle: React.FC<Props> = (props) => {
  const { isCanvas } = useChartState();
  if (isCanvas) {
    return <Fragment>{props.children}</Fragment>;
  }

  return <HandleInner {...props} />;
};

const HandleInner: React.FC<Props> = ({
  onClick,
  elementPosition,
  meta,
  children,
}) => {
  const { scaleX, scaleY, containerOffset } = useChartState();

  const getData = useCallback(
    (event: Event): Interaction => {
      return {
        meta: meta || {},
        elementPosition,
        event,
        pointerPosition: [
          scaleX.invert(event.clientX - containerOffset[0]),
          scaleY.invert(event.clientY - containerOffset[1]),
        ],
      };
    },
    [meta, elementPosition, scaleX, scaleY, containerOffset]
  );

  const handleClick = useCallback(
    (event: Event) => {
      if (onClick) {
        onClick(getData(event));
      }
    },
    [onClick, getData]
  );

  return <g onClick={handleClick}>{children}</g>;
};

export default Handle;
