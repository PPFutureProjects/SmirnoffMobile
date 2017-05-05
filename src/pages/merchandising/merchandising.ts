import { Component } from '@angular/core';
import { NavController  ,NavParams , ViewController} from 'ionic-angular';

/*
  Generated class for the Frigo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-merchandising',
  templateUrl: 'merchandising.html'
})
export class Merchandising {
rapport:any={};

constructor(public navCtrl: NavController, public navParams:NavParams,  public viewCtrl: ViewController) {
     this.rapport=navParams.get('rapport'); 
  }

  
 dismiss(data?:any) {   
      this.viewCtrl.dismiss(data);
  } 

  ionViewDidLoad() {
    console.log('Hello Frigo Page');
  }

}
