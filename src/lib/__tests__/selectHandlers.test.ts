import selectHandlers from '../selectHandlers';

describe('selectHandlers', () => {
  const props = {
    another: 'prop',
    onPointerDown: () => null,
  };

  it('includes ChartEventHandlers', () => {
    expect(selectHandlers(props)).toHaveProperty('onPointerDown');
  });

  it('excludes all other properties', () => {
    expect(selectHandlers(props)).not.toHaveProperty('another');
  });

  it('can remap the handler', () => {
    const mapper = () => 'remapped';
    const result = selectHandlers(props, mapper);
    expect(result).toHaveProperty('onPointerDown', 'remapped');
    expect(result).not.toHaveProperty('another');
  });
});
