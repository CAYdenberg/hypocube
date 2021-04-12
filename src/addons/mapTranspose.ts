// Maps the rows in a 2D array, and simultaneously (ie without performing another loop)
// transposes them (moves the inner array out)

export const mapTranspose = <T>(
  input: Array<Array<any>>,
  mapRow: (inputRow?: Array<any>) => Array<T>
): Array<Array<T>> => {
  return input;
};
