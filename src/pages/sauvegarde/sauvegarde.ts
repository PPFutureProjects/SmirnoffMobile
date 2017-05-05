import { Component } from '@angular/core';
import {Events, NavController ,AlertController,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Manager} from '../../providers/manager';
import {AppNotify} from '../../app/app-notify';
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


@Component({
  selector: 'page-sauvegarde',
  templateUrl: 'sauvegarde.html'
})
export class Sauvegarde {
 lastSavedDate:any;
 point_ventes_saved:any;
 visites_saved:any;
 quartiers_saved:any;
 synchro:Synchro;
 loader:any;
  constructor(public navCtrl: NavController,
  public storage: Storage, 
  public manager: Manager,  
  public events: Events, 
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public appNotify: AppNotify
           ) {}

  ionViewDidLoad() {
    console.log('Hello Sauvegarde Page');
        this.storage.get('_last_saved_date').then((data) =>{  
         this.lastSavedDate=  data;
      } );
      
      this.storage.get('_point_ventes_saved').then((data) =>{  
           if(data)
             this.point_ventes_saved=  data;
      } );

      this.storage.get('_visites_saved').then((data) =>{  
           if(data)
             this.visites_saved=  data;
      } );

        this.storage.get('_quartiers_saved').then((data) =>{  
           if(data)
             this.quartiers_saved=  data;
      } );      

    this. listenToEvents();          
  }

  startUpload(){
    let nowDate=new Date();
    
    var datePipe = new DatePipe('en');
     let user=this.manager.getUserId();
     let id=user+'_'+datePipe.transform(nowDate, 'yyyyMMddHHmmss');   
      this.synchro=new Synchro(user,id);
     this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
      duration: 20000
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
          });            
          } );                           
    } );    
 } );
  this.loader.present();
  }


onSucess(){
  this.point_ventes_saved=true;
  this.visites_saved=true;
   this.quartiers_saved=true;
    this.storage.set('_etapes_saved',true);
    this.storage.set('_point_ventes_saved',true);
    this.storage.set('_visites_saved',true);
    this.storage.set('_quartiers_saved',true);
    this.storage.set('_quartiers_loaded', false);
    this.storage.set('_failed_synchro_',undefined); 
    return this.storage.get('_pointVentes').then((data) =>{  
           let pointVentes= data;
           if(pointVentes)
             pointVentes.forEach((pointVente) => {
             pointVente.nonSaved=false;
      });
      this.storage.set('_pointVentes',pointVentes);
      } )
     .then(()=>{
             this.storage.get('_visites').then((data) =>{  
                let visites=  data;
                if(visites)
                 visites.forEach((visite) => {
                 visite.nonSaved=false;;
              });
          this.storage.set('_visites',visites);     
          } );
       })
     .then(()=>{
             this.storage.get('_quartiers').then((data) =>{  
                let quartiers=  data;
                if(quartiers)
                 quartiers.forEach((quartier) => {
                 quartier.nonSaved=false;;
              });
          this.storage.set('_quartiers',quartiers);     
          } );
       });       
; 
}
retry(){
  
   this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
      duration:20000
    });
     this.storage.get('_failed_synchro_').then((synchro) =>{  
           if(synchro)
             this.manager.asynch(synchro).then(success=>{ 
          });
      } );
 this.loader.present();
}
  isSaved(){
    return this.point_ventes_saved&&this.visites_saved&&this.quartiers_saved;
  }

 listenToEvents() {
     this.events.subscribe('symchro:success', () => {
      this.storage.set('_failed_synchro_',undefined);
      this. onSucess().then(()=>{
               if(this.loader)
                 this.loader.dismiss();
                this.appNotify.onSuccess({message:'Opération terminée avec succès',showCloseButton:false});
              });
    });  

     this.events.subscribe('symchro:error', () => {
      this.storage.set('_failed_synchro_',this.synchro);
      if(this.loader)
        this.loader.dismiss(); 
       this.alert();
    });  
       this.events.subscribe('symchro:failed', () => {
         if(this.loader)
          this.loader.dismiss();
         this.storage.set('_failed_synchro_',this.synchro);  
        this.appNotify.onError({message:"Un problème est survenu pendant cette opération. Vérifiez votre connexion puis réessayez."});
    }); 
}

 alert() {
    let confirm = this.alertCtrl.create({
      title: 'Connexion',
      message: "Il se peut que votre connexion soit quelques peu pertubée. Veillez réessayer",
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
