export class Repo {
  constructor(
    public projectOwner: string,
    public name: string,
    public stars: number,
    public forks: number,
    public issues: number,
    public dateTimeUTC: string,
  ) {}
}