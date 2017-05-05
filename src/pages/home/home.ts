import { Component } from '@angular/core';
import {Events, NavController,ModalController,AlertController,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {PointVente as PointVentePage} from '../point-vente/point-vente';
import {Rapport as VisitePage} from '../rapport/rapport';
import { Manager} from '../../providers/manager';
import {DatePipe} from "@angular/common";
/*
  Generated class for the Home page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
    pointVentes:any=[];
    visites:any=[];
    queryText = '';
  constructor(public navCtrl: NavController,
         public alertCtrl: AlertController,
         public modalCtrl: ModalController, 
         public events: Events,
         public manager: Manager,
         public loadingCtrl: LoadingController,
         public storage: Storage ) {}

  ionViewDidLoad() {
    console.log('Hello Home Page');
    this.initializeItems();
  }

  initializeItems(){
     this.storage.get('_pointVentes').then((data) =>{  
     this.pointVentes= data?data:[];
      } );
    this.listenToEvents();
  }

  listenToEvents() {
     this.events.subscribe('load:success', () => {
     this.storage.get('_pointVentes').then((data) =>{  
     this. pointVentes=  data?data:[];
      } );
    });
} 
  startVisite(pointVente:any){
     this.navCtrl.push(VisitePage,{pointVente:pointVente}); 

  }

  createPdv(){
          let modal = this.modalCtrl.create(PointVentePage);
          modal.onDidDismiss(data => { 
           if (data) {
           console.log(data);  
           data.user=this.manager.getUserId();                   
           this.pointVentes.push(data); 
           this.storage.set('_pointVentes', this.pointVentes);
           this.storage.set('_point_ventes_saved', false);
        }             
   });
 modal.present(); 
}


search() {
  let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
  let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
   this.pointVentes.forEach(item => {
   item.hide = true;
   this.filter(item, queryWords);
   });
  }

loadData(){
    let loader = this.loadingCtrl.create({
    });  
  this.manager.getPointVentes().then(succes=>{
    if(loader)
       loader.dismiss();
  });
   loader.present();
}

filter(item, queryWords){
let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1 ) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
     item.hide = !(matchesQueryText );
}


}
