export class DateTime {
  public static local(year: number, month: number) {
    return new DateTime();
  }

  public static fromISO(raw: string) {
    return new DateTime();
  }

  public toLocaleString(args: Record<string, string>) {
    return 'LOCALE STRING';
  }
}
