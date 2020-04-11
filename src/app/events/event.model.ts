interface EventPerson {
  _id: String;
  counter: Number;
  name: String;
  description: String;
  imageUrl: String;
}

export class Event {
  constructor(
    public _id: String,
    public person: EventPerson,
    public description: String,
    public imageUrl: String,
    public raspiId: String,
    public createdAt: Date
  ) {}
}
