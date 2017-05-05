import { Component } from '@angular/core';
import { NavController , ViewController,AlertController,ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {DatePipe} from "@angular/common";
import {Geolocation} from 'ionic-native';
import { Manager} from '../../providers/manager';
import { Quartiers } from '../quartiers/quartiers';

@Component({
  selector: 'page-point-vente',
  templateUrl: 'point-vente.html'
})

export class PointVente {
 pointVente:any={type:'Boutique de quartier'};
  pointVentes:any=[];
  secteur:any;
  long:any;
  lat:any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl:ModalController,
    public storage: Storage, 
    public viewCtrl: ViewController,
    public manager: Manager,) {
    }

  ionViewDidLoad() {
    console.log('Hello PointVente Page');  
     this.pointVente.ville=this.manager.getUserVille(); 
     this.storage.get('_pointVentes').then((data) =>{  
         this. pointVentes=  data;
      } );
  
     Geolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(pos => {
           if(pos && pos.coords){
           this.lat=pos.coords.latitude;
           this.long=pos.coords.longitude;  
     }
    });       
  }

select(){
  let modal=this.modalCtrl.create(Quartiers,{pointVente:this.pointVente});
  modal.onDidDismiss(data => {
     console.log(data);
        this.pointVente.quartier=data;
   });
   modal.present();
}

isInvalid():boolean {
  return (!this.pointVente.nom||!this.pointVente.description);
}

dismiss(data?:any) {
   
      this.viewCtrl.dismiss(data);
  } 

exist(items, seach):any{
      let item= items.find((item) => {
       return  (item.nom==seach.nom && item.secteur==seach.secteur ) ;
      });

 return item;
}


onSubmit(){
   
if(!this.exist(this.pointVentes,this.pointVente)){
   let nowDate=new Date();
   var datePipe = new DatePipe('en');
   let user=this.manager.getUserId();
   let id=user+''+datePipe.transform(nowDate, 'yyyyMMddHHmmss');
   this.pointVente.id=id;
   this.pointVente.nonSaved=true;
   this.pointVente.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
   this.pointVente.latitude=this.lat;
    this.pointVente.longitude=this.long;
   this.dismiss(this.pointVente);
 console.log(JSON.stringify(this.pointVente));
}else
this.alert();
}

 alert() {
    let confirm = this.alertCtrl.create({
      title: '<b>Existe déja</b>',
      message: "<b>Il existe déjà un point de vente connu enrégistré sur le même nom.</b>",
        buttons: [

        {
          text: 'OK',
          handler:()=> {           

            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
