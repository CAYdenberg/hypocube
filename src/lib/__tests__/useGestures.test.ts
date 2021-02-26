import { TouchPoint, applyTouchPoints } from '../useGestures';

describe('applyTouchPoints', () => {
  const nullState = new Array();

  it('never updates if the pointerId is null', () => {
    const final = applyTouchPoints(null, { now: [1, 1] })(nullState.slice(0));
    expect(final).toEqual(nullState);
  });

  it('inserts data', () => {
    const final = applyTouchPoints(2, { start: [0, 0], now: [1, 2] })(
      nullState.slice(0)
    );
    expect(final).toHaveLength(1);
    expect(final[0]).toEqual({ start: [0, 0], now: [1, 2], pointerId: 2 });
  });

  it('updates a value', () => {
    const initial: TouchPoint[] = [
      { start: [0, 0], now: [1, 1], pointerId: 1 },
    ];
    const newData: Partial<TouchPoint> = {
      now: [2, 2],
    };
    const final = applyTouchPoints(1, newData)(initial);
    expect(final).toHaveLength(1);
    expect(final).toHaveProperty('0.now', [2, 2]);
  });

  it('removes values', () => {
    const initial: TouchPoint[] = [
      { start: [0, 0], now: [1, 1], pointerId: 1 },
    ];
    const final = applyTouchPoints(1, null)(initial);
    expect(final).toHaveLength(0);
  });
});
