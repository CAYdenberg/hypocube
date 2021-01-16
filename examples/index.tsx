import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart, Handle, Line, XAxis, YAxis } from '../src';

interface Example {
  name: string;
  render: ({ isCanvas }: { isCanvas: boolean }) => JSX.Element;
}

const examples: Example[] = [
  {
    name: 'Line',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 100], y: [-10, 100] }}
        isCanvas={isCanvas}
      >
        <Line
          path={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
        />
      </Chart>
    ),
  },
  {
    name: 'Filled line',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 100], y: [-10, 100] }}
        isCanvas={isCanvas}
      >
        <Line
          path={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
          fill="#000"
        />
      </Chart>
    ),
  },
  {
    name: 'Click handler',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 100], y: [-10, 100] }}
        isCanvas={isCanvas}
      >
        <Handle onClick={console.log} elementPosition={[0, 0]}>
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
    ),
  },
  {
    name: 'Scatter plot',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 110], y: [-30, 110] }}
        isCanvas={isCanvas}
      >
        <XAxis range={[0, 100]} tickPositions={[0, 50, 100]} />
        <YAxis range={[0, 100]} tickPositions={[0, 25, 50, 75, 100]} />
      </Chart>
    ),
  },
];

const App = () => {
  const [active, setActive] = useState<string>(examples[0].name);
  const example = examples.find((eg) => eg.name === active);

  return (
    <div>
      <ul className="example-menu">
        {examples.map((eg) => (
          <li key={eg.name}>
            <button type="button" onClick={() => setActive(eg.name)}>
              {eg.name}
            </button>
            &nbsp;|&nbsp;
          </li>
        ))}
      </ul>
      <hr />
      <div className="chart-area">
        <div className="chart-area-left">
          {example.render({ isCanvas: false })}
        </div>
        <div className="chart-area-right">
          {example.render({ isCanvas: true })}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
