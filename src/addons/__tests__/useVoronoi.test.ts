import { Dataseries } from '../../types';
import { flatten, extractFromFlat } from '../useVoronoi';

describe('flatten', () => {
  it('constructs a Voronoi diagram from a 2D series array', () => {
    const series: Dataseries[] = [
      {
        key: 'One',
        data: [
          [0, 0],
          [1, 3],
        ],
      },
      {
        key: 'Two',
        data: [
          [0, 2],
          [1, 5],
        ],
      },
    ];
    expect(flatten(series)).toHaveLength(4);
  });
});

describe('extractFromFlat', () => {
  it('finds the coordinates of the point based on the coordinates in the flatten array', () => {
    const series: Dataseries[] = [
      {
        key: 'One',
        data: [
          [0, 0],
          [1, 3],
        ],
      },
      {
        key: 'Two',
        data: [
          [0, 2],
          [1, 5],
        ],
      },
    ];
    expect(extractFromFlat(series, 2)).toEqual({
      seriesIndex: 1,
      seriesKey: 'Two',
      pointIndex: 0,
      point: [0, 2],
    });
  });

  it('finds the coordinates when the series have different lengths', () => {
    const series: Dataseries[] = [
      {
        key: 'One',
        data: [
          [0, 0],
          [1, 3],
        ],
      },
      {
        key: 'Two',
        data: [[0, 2]],
      },
      {
        key: 'Three',
        data: [[1, 5]],
      },
    ];

    expect(extractFromFlat(series, 3)).toEqual({
      seriesIndex: 2,
      seriesKey: 'Three',
      pointIndex: 0,
      point: [1, 5],
    });
  });

  it('returns null when the index is out of range', () => {
    const series: Dataseries[] = [
      {
        key: 'One',
        data: [
          [0, 0],
          [1, 3],
        ],
      },
      {
        key: 'Two',
        data: [[0, 2]],
      },
      {
        key: 'Three',
        data: [[1, 5]],
      },
    ];
    expect(extractFromFlat(series, 75000)).toBeNull();
  });
});
