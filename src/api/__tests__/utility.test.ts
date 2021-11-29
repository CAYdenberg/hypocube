import * as lib from '../utility';
import { Dataseries } from '../../types';

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
    expect(lib.flatten(series)).toHaveLength(4);
  });
});

describe('getColors', () => {
  it('creates colors from the provided palette', () => {
    const result = lib.getSeriesColors(['#fff', '#000'], 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual('rgb(255,255,255)');
    expect(result[1]).toEqual('rgb(0,0,0)');
  });

  it('gets the same endpoints event if there are steps in between', () => {
    const result = lib.getSeriesColors(['#fff', '#000'], 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual('rgb(255,255,255)');
    expect(result[2]).toEqual('rgb(0,0,0)');
  });
});

describe('getBarOffsets', () => {
  it('always produces an offset of 0 if there is one series', () => {
    const result = lib.getSeriesOffsets(10, 1);
    expect(result).toEqual([0]);
  });

  it('produces offsets centered on 0 for an odd number of series', () => {
    const final = lib.getSeriesOffsets(10, 3);
    expect(final).toEqual([-10, 0, 10]);
  });

  it('produces offsets centered on 0 for an even number of series', () => {
    const final = lib.getSeriesOffsets(10, 4);
    expect(final).toEqual([-15, -5, 5, 15]);
  });

  it('can produce an array of functions', () => {
    const final = lib.getSeriesOffsets(() => 10, 4);
    expect(final).toHaveLength(4);

    const resultFunc = final[0] as () => number;
    expect(resultFunc).toBeInstanceOf(Function);

    expect(resultFunc()).toEqual(-15);
  });
});
