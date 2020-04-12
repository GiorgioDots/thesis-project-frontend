import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { PeopleService } from "../people.service";

@Component({
  selector: "app-add-person",
  templateUrl: "./add-person.component.html",
  styleUrls: ["./add-person.component.scss"],
})
export class AddPersonComponent implements OnInit {
  public personForm: FormGroup;
  public isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private peopleService: PeopleService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.personForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      doNotify: new FormControl(true, [Validators.required]),
      image: new FormControl(null),
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel");
  }

  onSubmit() {
    this.isLoading = true;
    this.peopleService.createPerson(this.personForm.value).subscribe(
      () => {
        this.showToast("Person Created Successfully", "success");
        this.onCancel();
      },
      (error) => {
        console.log(error);
        let msg = "Cannot create the person. Please try again later";
        if (error.error) {
          if (error.error.message) {
            msg = error.error.message;
          }
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === "string") {
      try {
        imageFile = base64toBlob(
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.personForm.patchValue({ image: imageFile });
  }

  private async showToast(message, color) {
    const alertEl = await this.toastCtrl.create({
      animated: true,
      color: color,
      message: message,
      duration: 2500,
      keyboardClose: true,
    });
    alertEl.present();
  }
}

function base64toBlob(base64Data, contentType) {
  contentType = contentType || "";
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
