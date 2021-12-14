import { getDefaultState } from '../../components/base/ChartState';
import { ChartState } from '../../types';
import { normalize, contextualize, arrayRepeater } from '../normalize';

describe('test the tests', () => {
  it('should pass', () => {
    expect([0, 1, 2]).toHaveLength(3);
  });
});

describe('normalize', () => {
  it('takes the provided prop', () => {
    expect(normalize(1, 0)).toEqual(1);
  });

  it('takes the default if provided is undefined', () => {
    expect(normalize(undefined, 0)).toEqual(0);
  });
});

describe('contextualize', () => {
  const state: ChartState = getDefaultState();

  it('can find a prop from a function', () => {
    expect(contextualize(() => 1, 0, state)).toEqual(1);
  });
});

describe('arrayRepeater', () => {
  describe('from an item', () => {
    const repeater = arrayRepeater(1);
    expect(repeater(0)).toEqual(1);
    expect(repeater(1000)).toEqual(1);
  });

  describe('from an array', () => {
    const repeater = arrayRepeater([1, 3, 5]);
    expect(repeater(0)).toEqual(1);
    expect(repeater(3)).toEqual(1);
    expect(repeater(4)).toEqual(3);
  });
});
