import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Shape } from '../src';

const App = () => {
  return (
    <div>
      <Chart height={900} view={{ x: [-10, 100], y: [-10, 100] }}>
        <Shape
          data={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
        />
      </Chart>
      <Chart height={900} view={{ x: [-10, 100], y: [-10, 100] }} isCanvas>
        <Shape
          data={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
        />
      </Chart>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
