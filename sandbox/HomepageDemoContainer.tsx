import './demo.css';

import React, { useState } from 'react';
import { Viewbox } from '../src';
import usePannable from '../src/addons/usePannable';
import HomepageTimeseries from './HomepageTimeseries';

interface AppState {
  isCanvas: boolean;
  tab: number;
  selected: Record<string, string | number> | null;
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
    tab: 0,
    selected: null,
  });

  const update = (nextState: Partial<AppState>) => {
    setState((current) => ({
      ...current,
      ...nextState,
    }));
  };

  return children({ state, update, view, setView, scrollToView });
};

const LegendItem: React.FC<{ color: string }> = ({ color, children }) => {
  return (
    <li className="legend-item" style={{ color }}>
      <span
        className="legend-item-indicator"
        style={{ background: color }}
      ></span>
      {children}
    </li>
  );
};

const COLORS = {
  Vancouver: '#003f5c',
  Victoria: '#58508d',
  Kelowna: '#bc5090',
} as Record<string, string>;

const Controls: React.FC<{
  state: AppState;
  update: (state: Partial<AppState>) => void;
}> = ({ state, update }) => {
  const setIsCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: boolean = e.target.value === 'true';
    update({ isCanvas: value });
  };

  return (
    <div className="ctls-container">
      <div className="ctls-left">
        <label className="ctls-radio-label">
          <input
            type="radio"
            className="ctls-radio"
            name="isCanvas"
            value="false"
            checked={!state.isCanvas}
            onChange={setIsCanvas}
          />
          <span>SVG</span>
        </label>
        <label className="ctls-radio-label">
          <input
            type="radio"
            className="ctls-radio"
            name="renderAs"
            value="true"
            checked={state.isCanvas}
            onChange={setIsCanvas}
          />
          <span>Canvas</span>
        </label>
      </div>
      <div className="ctls-center">
        <ul className="legend">
          <LegendItem color={COLORS.Vancouver}>Vancouver</LegendItem>
          <LegendItem color={COLORS.Victoria}>Victoria</LegendItem>
          <LegendItem color={COLORS.Kelowna}>Kelowna</LegendItem>
        </ul>
      </div>
      <div className="ctls-right">
        {state.selected ? (
          <div style={{ color: COLORS[state.selected.series] }}>
            <p className="tooltip-line">{state.selected.series}</p>
            <p className="tooltip-line">{state.selected.x}</p>
            <p className="tooltip-line">{state.selected.y} mm</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const DemoContainer: React.FC = () => (
  <StateContainer>
    {({ state, update, view, setView, scrollToView }) => (
      <React.Fragment>
        <p>
          <a href="https://github.com/CAYdenberg/hypocube/blob/main/sandbox/HomepageTimeseries.tsx">
            View Code
          </a>
        </p>
        <div className="hp-timeseries-wrapper">
          <HomepageTimeseries
            isCanvas={state.isCanvas}
            view={view}
            setView={setView}
            scrollToView={scrollToView}
            handlePointSelect={(data) =>
              update({
                selected: data,
              })
            }
            handleClearSelect={() => update({ selected: null })}
          />
          <div className="drag-direction">Drag or swipe to move the x-axis</div>
        </div>
        <Controls state={state} update={update} />
      </React.Fragment>
    )}
  </StateContainer>
);

export default DemoContainer;
