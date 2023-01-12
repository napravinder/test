import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ImageService, ApiImage } from '../api/image.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../storage.service';
import { ToastService } from '../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.page.html',
  styleUrls: ['./add-gallery.page.scss'],
})
export class AddGalleryPage implements OnInit {
  images:any[];
  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  sno1:any;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  constructor( private http: HttpClient,private authService:AuthService,
    private storageService:StorageService,
    private toastSevice:ToastService,private storage:Storage,private api: ImageService,
     private loadingCtrl:LoadingController,private plt: Platform, private actionSheetCtrl: ActionSheetController) {
      this.loadImages();
   }
   loadImages() {
      //get stored sno no
 this.storageService.get('sno').then((sno) => {
  if (sno !== false) {

    this.storageService.get('type').then((type) => {
      this.http.post('https://baobabsports.com/baosport/ios/get_gallery.php', {
        "sno": sno,
        "type": type
      }).subscribe(
        res => {
          this.images=res['view_images'];
        },
        err => {
          console.log(err);
        }
      );
    });
   

  }
});
  }
   
  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose  Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];
 
    
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }
  
  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    }).catch(reason => {
      console.error('error while taking picture', reason);
      });;
    // this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      const imageName = 'Give me a name';
      let base64Image =  image;
      this.api.uploadImage(base64Image, imageName).subscribe((newImage: ApiImage) => {
                this.loadImages();
                this.presentLoading();
             }, (err) => {
              // Handle error
             });
    // }, (err) => {
    //   // Handle error
    // });
//     this.camera.getPicture(this.options).then((imageData) => {
//       // imageData is either a base64 encoded string or a file URI
//       // If it's base64 (DATA_URL):
//       const imageName = 'Give me a name';
//       let base64Image = 'data:image/jpeg;base64,' + imageData;
//       this.api.uploadImage(base64Image, imageName).subscribe((newImage: ApiImage) => {
//         this.loadImages();
//         this.presentLoading();
//      }, (err) => {
//       // Handle error
//      });
//  });
}
 
 // Used for browser direct file upload
 uploadFile(event: EventTarget) {
  // this.presentLoading();
  // const eventObj: MSInputMethodContext = event as MSInputMethodContext;
  // const target: HTMLInputElement = eventObj.target as HTMLInputElement;
  // const file: File = target.files[0];
  // this.api.uploadImageFile(file,"https://baobabsports.com/baosport/ios/add_new_gallery.php").subscribe((newImage: ApiImage) => {
  //   this.loadImages();
  //   this.presentLoading();
  // });
}
  // Used for browser direct file upload
  // uploadFile(event: EventTarget) {
  //   const eventObj: MSInputMethodContext = event as MSInputMethodContext;
  //   const target: HTMLInputElement = eventObj.target as HTMLInputElement;
  //   const file: File = target.files[0];
  //   this.api.uploadImageFile(file).subscribe((newImage: ApiImage) => {
  //     this.images.push(newImage);
  //   });
  // }
 
  deleteImage(image: ApiImage, index) {
    this.api.deleteImage(image.id).subscribe(res => {
      this.images.splice(index, 1);
      if(res['status']=='true'){
        this.toastSevice.presentToast("image deleted Successfully");
  
      }else{
        this.toastSevice.presentToast("Something went wrong");
      }

    });
  }
 
  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  ngOnInit() {
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    
  }
  
}
