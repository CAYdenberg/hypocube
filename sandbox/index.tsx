import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import stories from './stories';

const App = () => {
  const [active, setActive] = useState<string>(stories[0].name);
  const story = stories.find((eg) => eg.name === active);

  if (!story) return null;

  // this is to confirm that string rendering can work. Width will not
  // match the client-rendered and canvas-rendered version, and interactivity
  // will not work.
  const __html = renderToString(story.render({ isCanvas: false }));

  return (
    <div>
      <ul className="example-menu">
        {stories.map((eg) => (
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
        {/* <div>{story.render({ isCanvas: false })}</div> */}
        <div>{story.render({ isCanvas: true })}</div>
        {/* <div dangerouslySetInnerHTML={{ __html }} /> */}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
