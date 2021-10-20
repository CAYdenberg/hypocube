export const tickIsShown = (index: number, modulus: number): boolean =>
  !(index % modulus);

export const tickPos = (tick: number | [number, string]): number => {
  if (Array.isArray(tick)) {
    return tick[0];
  }
  return tick;
};

const defaultGetTickLabel = (value: number) => value.toString();

export const normalizeGetTickLabel = (
  getTickLabel: (value: number) => string = defaultGetTickLabel
) => (tick: number | [number, string]): string => {
  if (Array.isArray(tick) && typeof tick[1] === 'string') {
    return tick[1];
  }

  return getTickLabel(tickPos(tick));
};
