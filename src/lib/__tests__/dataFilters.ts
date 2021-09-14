import { scaleLinear } from 'd3-scale';
import { ChartState, Point } from '../../types';
import * as lib from '../dataFilters';
import { createViewbox } from '../Viewbox';

describe('filterToView', () => {
  // construct a state for the chart in which the cartesian and px views
  // are identical (meaning the scales return the same value in both directions)
  const view = createViewbox([0, 0, 5, 5]);
  const scaleX = scaleLinear()
    .domain([0, 1])
    .range([0, 1]);
  const scaleY = scaleLinear()
    .domain([0, 1])
    .range([0, 1]);
  const state: ChartState = {
    cartesianBox: view,
    pxBox: view,
    scaleX,
    scaleY,
    isCanvas: false,
    pushToCanvasQueue: null,
  };

  const data: Point[] = [
    [-1, 0],
    [-1, 1],
    [0, 2],
    [4, 7],
    [4, 7],
    [4, 7],
    [5, 3],
    [6, 4],
    [6, 5],
  ];

  it('keeps data points when they are in view, or are adjacent to a point that is in view', () => {
    expect(lib.filterToView(data, state)).toEqual([
      [-1, 1],
      [0, 2],
      [4, 7],
      [4, 7],
      [5, 3],
      [6, 4],
    ]);
  });

  it('works on the edge case of a unipartite array', () => {
    expect(lib.filterToView([[0, 2]], state)).toHaveLength(1);
  });
});
