import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Geolocation} from 'ionic-native';
import {DatePipe} from "@angular/common";
import { Manager} from '../../providers/manager';
/*
  Generated class for the Journnee page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-journnee',
  templateUrl: 'journnee.html'
})
export class Journnee {
  matin:any;
  journees:any=[];
  long:any;
  lat:any;
  constructor(public navCtrl: NavController, public storage: Storage,  public manager: Manager,public loadingCtrl: LoadingController, ) {}

  ionViewDidLoad() {
        let nowDate=new Date();
      var datePipe = new DatePipe('en');
      let _date=datePipe.transform(nowDate, 'yyyy-MM-dd');   
    console.log('Hello Journnee Page');
         this.storage.get(_date).then((data) =>{  
         this.matin=  data;
      } );
       this.storage.get('_etapes').then((data) =>{  
           if(data)
             this.journees=  data;
      } );
      let loader = this.loadingCtrl.create({
      content: "Localisation...",
      duration: 5000
    });
    Geolocation.getCurrentPosition().then(pos => {
           if(pos && pos.coords){
           this.lat=pos.coords.latitude;
           this.long=pos.coords.longitude; 
           if(loader)
               loader.dismiss(); 
     }
    });
    loader.present();
  }

  debuter(){
      this.matin={};
      let nowDate=new Date();
      var datePipe = new DatePipe('en');
      this.matin.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
      this.matin.heure=datePipe.transform(nowDate, 'HH:mm'); 
      this.matin.nonSaved=true; 
      this.matin.type="debut";
      this.matin.user=this.manager.getUserId();
      this.storage.set(this.matin.date,this.matin); 
      this.storage.set('_etapes_saved', false); 
  }

    cloturer(){
      let soir:any={};
      let nowDate=new Date();
      var datePipe = new DatePipe('en');     
      soir.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
      soir.heure=datePipe.transform(nowDate, 'HH:mm');
      soir.type="fin";
       soir.latitude=this.lat;
      soir.longitude=this.long;
      this.matin.suivant=soir;
      console.log(JSON.stringify(this.matin));
      this.journees.push(this.matin);
      this.storage.set('_etapes',this.journees); 
      this.storage.set(soir.date,this.matin);
     
  }
}
