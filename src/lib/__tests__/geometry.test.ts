import * as lib from '../geometry';

import { Point } from '../../types';

describe('closeLineToEdge', () => {
  it('connects a polyline to a horizontal edge by adding two additional datapoints', () => {
    const data: Point[] = [
      [1, 2],
      [3, 4],
    ];
    const y = 6;
    const result = [
      [1, 6],
      [1, 2],
      [3, 4],
      [3, 6],
    ];
    expect(lib.closeLineToEdge(data, y)).toEqual(result);
  });

  it('returns null if the polyline has no length', () => {
    const data: Point[] = [[3, 4]];
    const y = 6;
    expect(lib.closeLineToEdge(data, y)).toBeFalsy();
  });
});
