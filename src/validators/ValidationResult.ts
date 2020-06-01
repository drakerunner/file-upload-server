export default class {
  constructor(private errors: (string | Error)[]) {
  }

  isValid(): boolean {
    return this.errors?.length === 0;
  }

  errorsSummary(): string {
    return this.errors?.map(e => {
      if (e instanceof Error) return e.message;
      if (typeof (e) === 'string') return e;

      return '';
    }).filter(e => e !== '').join('\n');
  }
}
