import React, { useCallback, useState } from 'react';
import { Chart, Handle, HypocubeEventData, Symbol } from '../src';

const SimpleVoronoi: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const [clicked, setClicked] = useState('');
  const handleSymbolClick = useCallback(
    (data: HypocubeEventData) => setClicked(data.meta['name'] as string),
    []
  );

  return (
    <React.Fragment>
      <p>{clicked}</p>
      <Chart
        height={300}
        width={300}
        view={[-10, -10, 110, 110]}
        isCanvas={isCanvas}
      >
        <Handle
          onPointerDown={handleSymbolClick}
          elementPosition={[0, 0]}
          meta={{ name: 'Black' }}
        >
          <Symbol symbol="circle" size={5} point={[0, 0]} fill="#000" />
        </Handle>
        <Handle
          onPointerDown={handleSymbolClick}
          elementPosition={[25, 75]}
          meta={{ name: 'Red' }}
        >
          <Symbol symbol="circle" size={5} point={[25, 75]} fill="#F00" />
        </Handle>
        <Handle
          onPointerDown={handleSymbolClick}
          elementPosition={[50, 0]}
          meta={{ name: 'Green' }}
        >
          <Symbol symbol="circle" size={5} point={[50, 0]} fill="#0F0" />
        </Handle>
      </Chart>
    </React.Fragment>
  );
};

export default SimpleVoronoi;
