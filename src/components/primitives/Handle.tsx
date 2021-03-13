import React, { Fragment } from 'react';
import useChartState from '../base/ChartState';
import useHandle, { HandlerProps } from '../../lib/useHandle';
import useRescaleGestures from '../../lib/useRescaleGestures';

export const ChartHandle: React.FC<HandlerProps> = ({ children, ...props }) => {
  const handlers = useHandle(props);
  const bind = useRescaleGestures(props);
  return (
    <div {...handlers} {...bind()}>
      {children}
    </div>
  );
};

const Handle: React.FC<HandlerProps> = (props) => {
  const { isCanvas } = useChartState();
  if (isCanvas) {
    return <Fragment>{props.children}</Fragment>;
  }

  return <HandleInner {...props} />;
};

const HandleInner: React.FC<HandlerProps> = ({ children, ...props }) => {
  const handlers = useHandle(props);
  return <g {...handlers}>{children}</g>;
};

export default Handle;
