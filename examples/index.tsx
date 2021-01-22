import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import examples from './examples';

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
