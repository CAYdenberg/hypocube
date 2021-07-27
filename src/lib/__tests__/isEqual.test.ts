import isEqual from '../isEqual';
import Viewbox from '../Viewbox';

describe('custom isEqual', () => {
  it('with equal primatives', () => {
    expect(isEqual({ a: 1, b: 'one' }, { a: 1, b: 'one' })).toBeTruthy();
  });

  it('with unequal primatives', () => {
    expect(isEqual({ a: 1, b: 'one' }, { a: 2, b: 'two' })).toBeFalsy();
  });

  it('with equal viewbox', () => {
    const a = new Viewbox(0, 0, 10, 10);
    const b = new Viewbox(0, 0, 10, 10);
    expect(isEqual({ a }, { a: b })).toBeTruthy();
  });

  it('with unequal viewbox', () => {
    const a = new Viewbox(0, 0, 10, 10);
    const b = new Viewbox(0, 0, 10, 20);
    expect(isEqual({ a }, { a: b })).toBeFalsy();
  });

  it('with an equal object composed of primatives', () => {
    const a = {
      series: 'blue',
    };
    const b = {
      series: 'blue',
    };
    expect(isEqual({ a }, { a: b })).toBeTruthy();
  });

  it('with an unequal object composed of primatives', () => {
    const a = {
      series: 'blue',
    };
    const b = {
      series: 'green',
    };
    expect(isEqual({ a }, { a: b })).toBeFalsy();
  });

  it('with an additional property', () => {
    expect(
      isEqual({ a: 1, b: 'one' }, { a: 1, b: 'one', c: true })
    ).toBeFalsy();
  });

  it('with a missing property', () => {
    expect(isEqual({ a: 1, b: 'one' }, { a: 1 })).toBeFalsy();
  });
});
