import { Point } from '../../types';
import * as lib from '../dataFilters';
import { createViewbox } from '../Viewbox';

describe('filterToView', () => {
  const view = createViewbox([0, 0, 5, 5]);
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
    expect(lib.filterToView(data, view)).toEqual([
      [-1, 1],
      [0, 2],
      [4, 7],
      [4, 7],
      [5, 3],
      [6, 4],
    ]);
  });

  it('works on the edge case of a unipartite array', () => {
    expect(lib.filterToView([[0, 2]], view)).toHaveLength(1);
  });
});
