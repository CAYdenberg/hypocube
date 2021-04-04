import React, { useCallback, useState } from 'react';
import { Chart, Handle, Line } from '../src';

const ClickHandler: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const [count, setCount] = useState(0);
  const bump = useCallback(() => setCount((old) => old + 1), []);
  return (
    <React.Fragment>
      <p>{count}</p>
      <Chart
        height={300}
        width={300}
        view={[-10, -10, 110, 110]}
        isCanvas={isCanvas}
      >
        <Handle onPointerDown={bump} elementPosition={[0, 0]}>
          <Line
            path={[
              [0, 0],
              [25, 75],
              [50, 0],
            ]}
            fill="#000"
          />
        </Handle>
      </Chart>
    </React.Fragment>
  );
};

export default ClickHandler;
