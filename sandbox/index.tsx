import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import stories from './stories';

const App = () => {
  const [active, setActive] = useState<string>(stories[0].name);
  const story = stories.find(eg => eg.name === active);

  if (!story) return null;

  return (
    <div>
      <ul className="example-menu">
        {stories.map(eg => (
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
          {story.render({ isCanvas: false })}
        </div>
        <div className="chart-area-right">
          {story.render({ isCanvas: true })}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
