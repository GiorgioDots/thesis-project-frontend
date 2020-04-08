export class User {
  constructor(
    public id: String,
    public email: String,
    public name: String,
    private _token: String
  ) {}
  get token() {
    return this._token;
  }
}
