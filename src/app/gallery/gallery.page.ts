import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { GalleryModalPage } from '../gallery-modal/gallery-modal.page';
import { ModalController, IonSlides } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../storage.service';
import { ToastService } from '../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };
  public images:any[]
  constructor(private modalController: ModalController, 
    private changeDetectorRef: ChangeDetectorRef,
    private authService:AuthService,
    private storageService:StorageService,
    private toastSevice:ToastService,
    private http: HttpClient,
    private storage:Storage,
    private loadingCtrl:LoadingController) { 
    this.presentLoading();
    //get stored sno no
    this.storageService.get('sno').then((sno) => {
     if (sno !== false) {
       this.loadingCtrl.dismiss();
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

  ngOnInit() {
  }
  async openPreview(img) {
    const modal = await this.modalController.create({
      component: GalleryModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });
    modal.present();
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }
}
