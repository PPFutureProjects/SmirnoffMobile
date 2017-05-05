import { Injectable } from '@angular/core';
import {Events ,AlertController,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Manager} from './manager';
import {AppNotify} from '../app/app-notify';
import {DatePipe} from "@angular/common";
export class Synchro{
user:any;
id:any;
pointVentes:Array<any>=[];
rapports:Array<any>=[];
quartiers:Array<any>=[];
status:any;
constructor(user:any,id:any){
this.user=user;
this.id=id;
}
}


@Injectable()
export class Asynch {
 lastSavedDate:any;

 synchro:Synchro;
 loader:any;
  constructor(
  public storage: Storage, 
  public manager: Manager,  
  public events: Events, 
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public appNotify: AppNotify
           ) {  
           }
  startUpload(){
    let nowDate=new Date();
    
    var datePipe = new DatePipe('en');
     let user=this.manager.getUserId();
     let id=user+'_'+datePipe.transform(nowDate, 'yyyyMMddHHmmss');   
      this.synchro=new Synchro(user,id);
     this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
      duration: 15000
    });
   

  this.storage.get('_pointVentes').then((data) =>{  
           let pointVentes= data;
           if(pointVentes)
            this.synchro.pointVentes= pointVentes.filter((pointVente) => {
             return pointVente.nonSaved;
               });
               this.storage.get('_visites').then((data) =>{  
                let visites=data;
                if(visites)
                this.synchro.rapports= visites.filter((visite) => {
              return visite.nonSaved;
              });
                this.storage.get('_quartiers').then((data) =>{  
                  let quartiers=data;
                    if(quartiers)
                     this.synchro.quartiers= quartiers.filter((quartier) => {
                return quartier.nonSaved;
             });
            console.log(JSON.stringify(this.synchro)); 
           this.manager.asynch(this.synchro).then(success=>{
            if(success){
               this. onSucess().then(()=>{
                 if(this.loader)
                 this.loader.dismiss();
                this.appNotify.onSuccess({message:'Opération terminée avec succès',showCloseButton:false});
              });   
            } 
          });            
          } );                           
    } );    
 } );
  this.loader.present();
  }




onSucess(){

    this.storage.set('_point_ventes_saved',true);
    this.storage.set('_visites_saved',true);
    this.storage.set('_quartiers_saved',true);
    this.storage.set('_quartiers_loaded', false);
    this.storage.set('_failed_synchro_',undefined); 
    return this.storage.get('_pointVentes').then((data) =>{  
           let pointVentes= data;
           if(pointVentes)
             pointVentes.forEach((pointVente) => {
             pointVente.nonSaved=false;;
      });
      this.storage.set('_pointVentes',pointVentes);
      this.storage.get('_visites').then((data) =>{  
                let visites=  data;
                if(visites)
                 visites.forEach((visite) => {
                 visite.nonSaved=false;;
              });
          this.storage.set('_visites',visites);     
          } );
             this.storage.get('_quartiers').then((data) =>{  
                let quartiers=  data;
                if(quartiers)
                 quartiers.forEach((quartier) => {
                 quartier.nonSaved=false;;
              });
          this.storage.set('_quartiers',quartiers);     
          });
       }).then(()=>{
                 if(this.loader)
                 this.loader.dismiss();
                this.appNotify.onSuccess({message:'Opération terminée avec succès',showCloseButton:false});
          });;       
; 
}


retry(){
   this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
      duration: 15000
    });
     this.storage.get('_failed_synchro_').then((synchro) =>{  
           if(synchro)
             this.manager.asynch(synchro).then(success=>{
             if(success){
               this. onSucess()
            }  
          });
      } );
 this.loader.present();
}



 onError() {
   if(this.loader)
          this.loader.dismiss();
          this.storage.set('_failed_synchro_',this.synchro);    
    let confirm = this.alertCtrl.create({
      title: '<b>Connexion</b>',
      message: "<b>Il se peut que votre connexion soit quelques peu pertubée. Veillez réessayer</b>",
        buttons: [

        {
          text: 'Ressayer',
          handler:()=> {           
           this.retry();
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  } 
  
   
}
