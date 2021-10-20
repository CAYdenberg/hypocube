import { normalizeGetTickLabel } from '../ticks';

describe('normalizeGetTickLabel', () => {
  const getTickLabel = () => 'LABEL';

  it('uses the provided get tick label function when only a tick postition is given', () => {
    const result = normalizeGetTickLabel(getTickLabel)(5);
    expect(result).toEqual('LABEL');
  });

  it('overrides the calculated label is a specific label is given', () => {
    const result = normalizeGetTickLabel(getTickLabel)([5, 'FIVE']);
    expect(result).toEqual('FIVE');
  });

  it('returns the string representation of the number if no other label can be calculated', () => {
    const result = normalizeGetTickLabel()(5);
    expect(result).toEqual('5');
  });
});
