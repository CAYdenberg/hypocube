import React, { Fragment } from 'react';
import useChartState from '../base/ChartState';
import useHandle, { HandlerProps } from '../../lib/useHandle';
import useChartGestures from '../../lib/useChartGestures';
import { ChartGestureHandlers } from '../../types';
import { Pure } from '../../lib/HypocubePureComponent';

export const ChartHandle: React.FC<HandlerProps & ChartGestureHandlers> = ({
  children,
  onGesture,
  ...props
}) => {
  const ref = useChartGestures(onGesture);
  const handlers = useHandle(props);
  return (
    <div
      ref={onGesture ? ref : undefined}
      style={{
        touchAction: onGesture ? 'manipulation' : undefined,
      }}
    >
      <div {...handlers}>{children}</div>
    </div>
  );
};

const Handle = Pure<HandlerProps>((props) => {
  const { isCanvas } = useChartState();
  if (isCanvas) {
    return <Fragment>{props.children}</Fragment>;
  }

  return <HandleInner {...props} />;
});

const HandleInner: React.FC<HandlerProps> = ({ children, ...props }) => {
  const handlers = useHandle(props);
  return <g {...handlers}>{children}</g>;
};

export default Handle;
