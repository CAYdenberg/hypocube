import { Point } from '../../types';
import { flatten, extractFromFlat } from '../flatten';

describe('flatten', () => {
  it('constructs a Voronoi diagram from a 2D series array', () => {
    const series: Point[][] = [
      [
        [0, 0],
        [1, 3],
      ],
      [
        [0, 2],
        [1, 5],
      ],
    ];
    expect(flatten(series)).toHaveLength(4);
  });
});

describe('extractFromFlat', () => {
  it('finds the coordinates of the point based on the coordinates in the flatten array', () => {
    const series: Point[][] = [
      [
        [0, 0],
        [1, 3],
      ],
      [
        [0, 2],
        [1, 5],
      ],
    ];
    expect(extractFromFlat(series, 2)).toEqual({
      seriesIndex: 1,
      pointIndex: 0,
      point: [0, 2],
    });
  });

  it('finds the coordinates when the series have different lengths', () => {
    const series: Point[][] = [
      [
        [0, 0],
        [1, 3],
      ],
      [[0, 2]],
      [[1, 5]],
    ];
    expect(extractFromFlat(series, 3)).toEqual({
      seriesIndex: 2,
      pointIndex: 0,
      point: [1, 5],
    });
  });

  it('returns null when the index is out of range', () => {
    const series: Point[][] = [
      [
        [0, 0],
        [1, 3],
      ],
      [[0, 2]],
      [[1, 5]],
    ];
    expect(extractFromFlat(series, 75000)).toBeNull();
  });
});
