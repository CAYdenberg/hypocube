import React from 'react';
import ReactDOM from 'react-dom';
import { Reactscape, Shape } from '../src';

const App = () => {
  return (
    <div>
      <Reactscape pxHeight={900}>
        <Shape />
      </Reactscape>
      <Reactscape pxHeight={900} useCanvas>
        <Shape />
      </Reactscape>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
