import { Component } from '@angular/core';
import { NavController,NavParams,ModalController,AlertController  , ViewController} from 'ionic-angular';
import {DatePipe} from "@angular/common";
import { Storage } from '@ionic/storage';
import { Manager} from '../../providers/manager';
import { Situation } from '../situation/situation';
import { Merchandising} from '../merchandising/merchandising';
import { Winers } from '../winers/winers';
import { Rh } from '../rh/rh';
@Component({
  selector: 'page-rapport',
  templateUrl: 'rapport.html'
})
export class Rapport {
rapport:any={
              sminoffRed:{},
              sminoffBlack:{},
              sminoffBlue:{},
              heineken:{},
              boostrer:{},
              voodka:{},
              sabc1664:{},
              sabc:{},
              export:{},
              origine:{},
              gagnants:[],
            };

pointVente:any;
date:any;
stape:any='sales';
  rapports:any[]=[];
  constructor(
  public alertCtrl: AlertController,
  public navCtrl: NavController,
  public storage: Storage,
  public manager: Manager,
  public modalCtrl: ModalController, 
  public viewCtrl: ViewController,
  public navParams:NavParams) {
  this.pointVente=navParams.get('pointVente');
     this.storage.get(this.pointVente.id+'_last_rapport').then((data) =>{  
      if(data)
          this.rapport=this.setDefault(data);
      });  
  }

  ionViewDidLoad() {
    console.log('Hello rapport Page');
    let date=this.yesterday();
    var datePipe = new DatePipe('en');
    this.date=datePipe.transform(date, 'yyyy-MM-dd');
    this.rapport.date=this.date;
    this.rapport.pointVente=this.pointVente.id;
    this.rapport.user=this.manager.getUserId();
  }
yesterday(){
   let nowDate=new Date();
   return new Date(nowDate.setDate(nowDate.getDate()-1))
}


setDefault(rapport:any){
  if(rapport){
   rapport.rh1=undefined;
    rapport.date=this.date;
    rapport.posRealTarget=undefined;
    rapport.posRealDay=undefined;
     rapport.boostrer.bnreBlle=undefined;
      rapport.sminoffRed.bnreBlle=undefined;
        rapport.sminoffBlack.bnreBlle=undefined;
         rapport.sminoffBlue.bnreBlle=undefined;
          rapport.heineken.bnreBlle=undefined;
           rapport.sabc1664.bnreBlle=undefined;
            rapport.sabc.bnreBlle=undefined;
             rapport.voodka.bnreBlle=undefined;
               rapport.export.bnreBlle=undefined;
                rapport.origine.bnreBlle=undefined;     
  }
  return rapport;
}


rh(){
  let modal=this.modalCtrl.create(Rh,{rapport:this.rapport});
  modal.onDidDismiss(selectedItem => {
    if(selectedItem){
     this.rapport.rh=selectedItem.id;
    this.rapport.rhNom=selectedItem.nom;
    
    }    
     console.log(selectedItem);
   });
   modal.present();
}

rh1(){
  let modal=this.modalCtrl.create(Rh,{rapport:this.rapport});
  modal.onDidDismiss(selectedItem => {
        if(selectedItem){
     this.rapport.rh1=selectedItem.id;
    this.rapport.rh1Nom=selectedItem.nom;
    }  
     console.log(selectedItem);
   });
   modal.present();
}

merchant(){
  let modal=this.modalCtrl.create(Merchandising,{rapport:this.rapport});
  modal.onDidDismiss(data => {
     console.log(data);
   });
   modal.present();
}


 dismiss(data?:any) {   
      this.viewCtrl.dismiss(data);
  } 


open(obj:any,title:any){
  obj.marque=title;
  let modal=this.modalCtrl.create(Situation,{situation:obj,title:title});
  modal.onDidDismiss(data => {
     console.log(data);
     if(data){
            obj.color='secondary';
     }
   });
   modal.present();
}



saveRapport(){  
 // this.storage.remove('_visites');
  this.storage.get('_visites').then((val) =>{ 
   this.rapports=  val?val:[];
  let exist=this.isExist(this.rapport);
   this.rapport.nonSaved=true;
   //console.log(JSON.stringify(exist)); 
    console.log(JSON.stringify(this.rapports)); 
    if(!exist)
        this.store();
     else
          this.alert();
       } );           
      }



   store(){
           console.log('stored');
            this.rapports.push(this.rapport);
            this.storage.set('_visites', this.rapports);
            this.storage.set('_visites_saved', false); 
            this.storage.set(this.pointVente.id+'-'+this.rapport.date, "setted");
            this.storage.set(this.pointVente.id+'_last_rapport', this.rapport);
            this.dismiss();                   
  
}

isExist(rapport:any){
   let exist=this.rapports.find((rap)=>{
        return (rap.pointVente==rapport.pointVente&&rap.date==rapport.date);
      });
      return exist;
  }


attrParser(attr:any, val:any){
 switch (attr) {
   case "posTarget":
     return  this.rapport.posTarget=val;

   case "posRealTarget":
      return  this.rapport.posRealTarget=val;

   case "posRealDay":
       return this.rapport.posRealDay=val;          
   default:
      return;
 }
}

   isInvalid():boolean {
    return (!this.rapport.posRealTarget||!this.rapport.posRealDay)||
           !this.isValid(this.rapport.boostrer)||
           !this.isValid(this.rapport.sminoffRed)||
           !this.isValid(this.rapport.sminoffBlack)||
           !this.isValid(this.rapport.sminoffBlue)||
           !this.isValid(this.rapport.voodka)||
           !this.isValid(this.rapport.sabc1664)||
           !this.isValid(this.rapport.sabc)||
           !this.isValid(this.rapport.heineken)||
           !this.isValid(this.rapport.origine)||
           !this.isValid(this.rapport.export)||
           !this.rapport.rh;
  } 


isValid(obj:any){
  return (obj.bnreBlle!=undefined&&obj.price)|| obj.absent ||obj.enrupture;
}


color(obj:any){
if(this.isValid(obj))
 return 'secondary';
 return 'royal';
}


 setter(attr:any,title:any,type?:any) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: 'Saisir une valeur',

       inputs: [
        {
          name: 'value',
          type: type?type:'number'
        }
      ],

        buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'TERMINER',
          handler:  data=> {           
            if(data.value)
            this.attrParser(attr,data.value);
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
 alert() {
    let confirm = this.alertCtrl.create({
      title: '<b>Rapport</b>',
      message: "Ce point de vente a déja enrégistré un rapport pour cette date.",
        buttons: [

        {
          text: 'Annuler',
          handler:()=> {           
           this.dismiss();
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  freeIssue() {
    let confirm = this.alertCtrl.create({
      title: '<b>Nombre de FI</b>',
      message: 'Quel est le nombre de FI distribués ?',
    
       inputs: [
        {
          name: 'freeIssue',
          type: 'number',
          label:'Nombre de FI',
          value:this.rapport.freeIssue,
          placeholder:'Nombre de Free Issu'
       
        }
      ],

        buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'TERMINER',
          handler:  data=> {           
            if(data.freeIssue){
               this.rapport.freeIssue=data.freeIssue;
            }else
            this.rapport.freeIssue=0;
            console.log('Agree clicked'+data.freeIssue);
          }
        }
      ]
    });
    confirm.present();
  }
  
}
