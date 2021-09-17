import './demo.css';

import React, { useState } from 'react';
import HomepageTimeseries, { DataPoint } from './HomepageTimeseries';
import HomepageBar from './HomepageBar';

interface AppState {
  isCanvas: boolean;
  selected: DataPoint | null;
}

interface Args {
  state: AppState;
  update: (state: Partial<AppState>) => void;
}

interface Props {
  children: (args: Args) => JSX.Element;
}

const StateContainer: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isCanvas: false,
    selected: null,
  });

  const update = (nextState: Partial<AppState>) => {
    setState((current) => ({
      ...current,
      ...nextState,
    }));
  };

  return children({ state, update });
};

const Tabs: React.FC<{
  names: string[];
}> = ({ names, children }) => {
  const [tab, setTab] = useState<number>(0);
  const activeChild = React.Children.toArray(children)[tab];

  return (
    <div>
      <ul className="tabs">
        {names.map((name, i) => (
          <li className={`tabs-item${tab === i ? ' is-active' : ''}`}>
            <a onClick={() => setTab(i)}>{name}</a>
          </li>
        ))}
      </ul>
      {activeChild}
    </div>
  );
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
  Victoria: '#bc5090',
  Kelowna: '#ff6361',
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
            <p className="tooltip-line">{state.selected.xLabel}</p>
            <p className="tooltip-line">{state.selected.yLabel} mm</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const HomepageDemoContainer: React.FC = () => (
  <StateContainer>
    {({ state, update }) => (
      <React.Fragment>
        <Tabs names={['Scrollable Scatter Plot', 'Responsive Bar Chart']}>
          <div className="tab-content">
            <p>
              <a href="https://github.com/CAYdenberg/hypocube/blob/main/sandbox/HomepageTimeseries.tsx">
                View Code
              </a>
            </p>
            <div className="hp-timeseries-wrapper">
              <HomepageTimeseries
                isCanvas={state.isCanvas}
                colors={COLORS}
                selectedPoint={state.selected}
                handlePointSelect={(data) =>
                  update({
                    selected: data,
                  })
                }
                handleClearSelect={() => update({ selected: null })}
              />
            </div>
            <div className="drag-direction">
              Drag or swipe to move the x-axis
            </div>
          </div>
          <div className="tab-content">
            <p>
              <a href="https://github.com/CAYdenberg/hypocube/blob/main/sandbox/HomepageBar.tsx">
                View Code
              </a>
            </p>
            <HomepageBar
              isCanvas={state.isCanvas}
              colors={COLORS}
              selectedPoint={state.selected}
              handlePointSelect={(data) =>
                update({
                  selected: data,
                })
              }
              handleClearSelect={() => update({ selected: null })}
            />
          </div>
        </Tabs>
        <Controls state={state} update={update} />
      </React.Fragment>
    )}
  </StateContainer>
);

export const CoreConceptsDemoContainer: React.FC = ({
  children: _children,
}) => {
  const children = React.Children.toArray(_children);

  return (
    <div className="cc-container">
      {children.map((child, i) => (
        <div className="cc-item" key={i}>
          {child}
        </div>
      ))}
    </div>
  );
};
