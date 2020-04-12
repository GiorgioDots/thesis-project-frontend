export class Person {
  constructor(
    public _id: String,
    public name: String,
    public description: String,
    public counter: Number,
    public imageUrl: String,
    public doNotify: Boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
