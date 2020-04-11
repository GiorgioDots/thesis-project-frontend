import { Event } from "../events/event.model";
import { Person } from "../people/person.model";
import { LastImage } from "../raspberries/raspberry.model";

export class Dashboard {
  events: Event[];
  people: Person[];
  plantStatus: string;
  raspberriesImages: RaspberryImages;
}

interface RaspberryImages {
  raspiId: string;
  name: string;
  lastImages: LastImage[];
}
