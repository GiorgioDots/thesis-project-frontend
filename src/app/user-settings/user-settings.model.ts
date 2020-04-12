interface telegramInfo {
  _id?: String;
  name: String;
  telegramId: String;
}

export class UserSettings {
  constructor(
    public id: String,
    public email: String,
    public name: String,
    public telegramIds: [telegramInfo],
    public password?: String
  ) {}
}
