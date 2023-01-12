import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.page.html',
  styleUrls: ['./gallery-modal.page.scss'],
})
export class GalleryModalPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @Input('img')img: any;
 
  sliderOpts = {
    zoom: true
  };
 
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.slides.update();
  }
 
  async zoom(zoomIn: boolean) {
    const slider = await this.slides.getSwiper();
    const zoom = slider.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }
 
  close() {
    this.modalController.dismiss();
  }

}
