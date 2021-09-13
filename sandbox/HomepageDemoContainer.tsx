import React, { useState } from 'react';
import { Viewbox } from '../src';
import usePannable from '../src/addons/usePannable';
import HomepageTimeseries from './HomepageTimeseries';

interface AppState {
  isCanvas: boolean;
  tab: number;
  selected: 'Vancouver' | 'Victoria' | 'Kelowna' | null;
}

interface Args {
  state: AppState;
  update: (state: Partial<AppState>) => void;
  view: Viewbox;
  setView: (view: Viewbox) => void;
  scrollToView: (view: Viewbox) => void;
}

interface Props {
  children: (args: Args) => JSX.Element;
}

const StateContainer: React.FC<Props> = ({ children }) => {
  const [view, setView, scrollToView] = usePannable(
    [201, 0, 50, 250],
    [0, 0, 251, 250]
  );
  const [state, setState] = useState<AppState>({
    isCanvas: false,
    selectedSeries: null,
    selectedPoint: null,
    tab: 0,
  });

  const update = (nextState: Partial<AppState>) => {
    setState((current) => ({
      ...current,
      ...nextState,
    }));
  };

  return children({ state, update, view, setView, scrollToView });
};

const Controls: React.FC<{
  state: AppState;
  update: (state: AppState) => void;
}> = ({ state, update }) => {
  return (
    <div className="ctls-container">
      <div className="ctls-left">
        <label className="ctls-radio-label">
          <input
            type="radio"
            className="ctls-radio"
            name="renderAs"
            value="SVG"
          />
          <span>SVG</span>
        </label>
        <label className="ctls-radio-label">
          <input
            type="radio"
            className="ctls-radio"
            name="renderAs"
            value="Canvas"
          />
          <span>Canvas</span>
        </label>
      </div>
      <div className="ctls-middle">
        <ul className="legend">
          <li>Vancouver</li>
          <li>Victoria</li>
          <li>Kelowna</li>
        </ul>
      </div>
      <div className="ctls-right">
        {state.selectedPoint ? (
          <React.Fragment>
            <p>{state.selectedPoint.month}</p>
            <p>{state.selectedPoint.rainfall}</p>
          </React.Fragment>
        ) : null}
        <p></p>
      </div>
    </div>
  );
};

const DemoContainer: React.FC = () => (
  <StateContainer>
    {({ state, update, view, setView, scrollToView }) => (
      <React.Fragment>
        <HomepageTimeseries
          isCanvas={state.isCanvas}
          view={view}
          setView={setView}
          scrollToView={scrollToView}
        />
        <Controls state={state} update={update} />
      </React.Fragment>
    )}
  </StateContainer>
);

export default DemoContainer;
