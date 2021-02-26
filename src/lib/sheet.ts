// common functional programming patterns for 2D arrays. Input is rows,
// columns are cached as they are calculated. Data/Rows are immutable. Methods
// return either a new Sheet or an array.

export class Sheet {
  private rows: Array<Array<string | number | null>>;
  private columns: Array<Array<string | number | null>>;

  constructor(rows: Array<Array<number | string>>) {
    this.rows = rows;
  }

  map() {}

  selectColumns() {}

  appendColumns() {}

  concatColumns() {}
}
