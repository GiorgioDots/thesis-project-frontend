export interface LastImage {
  _id: String;
  imageUrl: String;
  imageId: String;
  timestamp: String;
}

export class Raspberry {
  constructor(
    public name: String,
    public raspiId: String,
    public resolution: String,
    public confidence: Number,
    public isActive: Boolean,
    public lastImages: LastImage[],
    public createdAt: Date,
    public updatedAt: Date,
    public wifiSSID?: String,
    public wifiPassword?: String
  ) {}
}
