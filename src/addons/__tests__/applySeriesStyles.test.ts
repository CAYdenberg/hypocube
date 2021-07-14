import * as lib from '../applySeriesStyles';

describe('createStylesSequential', () => {
  const mapper = lib.createStylesSequential('dataLineStroke', [
    '#000',
    '#ccc',
    '#fff',
  ]);

  it('applies each possible style to one series', () => {
    const final = mapper([{}, {}, {}]);
    expect(final).toHaveLength(3);
    expect(final[0].dataLineStroke).toEqual('#000');
    expect(final[1].dataLineStroke).toEqual('#ccc');
    expect(final[2].dataLineStroke).toEqual('#fff');
  });

  it('applies each style again if there are more series than possibilities', () => {
    const final = mapper([{}, {}, {}, {}]);
    expect(final).toHaveLength(4);
    expect(final[3].dataLineStroke).toEqual('#000');
  });

  it('works with arrays', () => {
    const mapper = lib.createStylesSequential(
      ['dataPointStroke', 'dataPointFill'],
      ['#000', '#ccc', '#fff']
    );

    const final = mapper([{}, {}, {}]);
    expect(final).toHaveLength(3);
    expect(final[0].dataPointStroke).toEqual('#000');
    expect(final[0].dataPointFill).toEqual('#000');
  });
});

describe('createBarOffsets', () => {
  it('always produces an offset of -0.5 if there is one series', () => {
    const final = lib.createBarOffsets([{}]);
    expect(final).toHaveLength(1);
    expect(final[0].dataBoxLeftOffset).toEqual(-0.5);
  });

  it('produces number offsets for even numbers of series', () => {
    const final = lib.createBarOffsets([{}, {}]);
    expect(final).toHaveLength(2);
    expect(final[0].dataBoxLeftOffset).toEqual(-1);
    expect(final[1].dataBoxLeftOffset).toEqual(0);
  });

  it('produces number offsets for odd numbers of series', () => {
    const final = lib.createBarOffsets([{}, {}, {}]);
    expect(final).toHaveLength(3);
    expect(final[0].dataBoxLeftOffset).toEqual(-1.5);
    expect(final[1].dataBoxLeftOffset).toEqual(-0.5);
    expect(final[2].dataBoxLeftOffset).toEqual(0.5);
  });
});
