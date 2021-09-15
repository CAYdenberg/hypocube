import * as lib from '../seriesStyle';

describe('getColors', () => {
  it('creates colors from the provided palette', () => {
    const result = lib.getColors(['#fff', '#000'], 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual('rgb(255,255,255)');
    expect(result[1]).toEqual('rgb(0,0,0)');
  });

  it('gets the same endpoints event if there are steps in between', () => {
    const result = lib.getColors(['#fff', '#000'], 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual('rgb(255,255,255)');
    expect(result[2]).toEqual('rgb(0,0,0)');
  });
});

describe('createBarOffsets', () => {
  it('always produces an offset of 0 if there is one series', () => {
    const result = lib.getBarOffsets(10, 1);
    expect(result).toEqual([0]);
  });

  it('produces offsets centered on 0 for an odd number of series', () => {
    const final = lib.getBarOffsets(10, 3);
    expect(final).toEqual([-10, 0, 10]);
  });

  it('produces offsets centered on 0 for an even number of series', () => {
    const final = lib.getBarOffsets(10, 4);
    expect(final).toEqual([-15, -5, 5, 15]);
  });

  it('can produce an array of functions', () => {
    const final = lib.getBarOffsets(() => 10, 4);
    expect(final).toHaveLength(4);

    const resultFunc = final[0] as () => number;
    expect(resultFunc).toBeInstanceOf(Function);

    expect(resultFunc()).toEqual(-15);
  });
});
