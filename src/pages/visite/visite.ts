import { Component } from '@angular/core';
import { NavController,NavParams,AlertController  , ViewController} from 'ionic-angular';
import {DatePipe} from "@angular/common";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-visite',
  templateUrl: 'visite.html'
})
export class Visite {
visite:any={};
pointVente:any;
stape:any='status';
  constructor(
  public alertCtrl: AlertController,
  public navCtrl: NavController,
  public storage: Storage,
  public viewCtrl: ViewController,
  public navParams:NavParams) {
  this.pointVente=navParams.get('pointVente');
 
  }

  ionViewDidLoad() {
    console.log('Hello Visite Page');
    let nowDate=new Date();
    var datePipe = new DatePipe('en');
    this.visite.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
    this.visite.pointVente=this.pointVente.id;
    this.visite.nonSaved=true; 
  }

 isInvalid():boolean {
    return (
       (this.stape=='status'&&((this.visite.pasClient && !this.visite.raisonPasClient)||(this.visite.pasOuvert && !this.visite.raisonPasOuvert)))||
       (this.stape=='comment'&&(!this.visite.commentaire))||
       (this.stape=='sell'&&(!this.visite.mvj||!this.visite.fp||!this.visite.ecl)));
  }

 dismiss(data?:any) {   
      this.viewCtrl.dismiss(data);
  } 


  goBack() {
     switch (this.stape){  
         case 'comment':
          this.stape='stocks';
         break;
         case 'stocks':
          this.stape='sell';
         break;
         case 'sell':
          this.stape='visibility';
         break;  
        case 'visibility':
          this.stape='status';
         break;                      
       default:
         this.dismiss();
         break;
     }
   }

  nextStape() {
    if(this.visite.pasClient || this.visite.pasOuvert){
      this.saveVisite();
       return;
      }
     switch (this.stape){
        case 'status':
          this.stape='visibility';
         break;  
         case 'visibility':
          this.stape='sell';
         break;
         case 'sell':
          this.stape='stocks';
         break;
         case 'stocks':
          this. confirmStock();
         break;               
       default:
      this.saveVisite();
         break;
     }
}


saveVisite(){
        this.pointVente.lastvisitedate=this.visite.date;
        this.pointVente.nombre+=1;
        this.pointVente.noVisiteSeaved+=true;
         this.dismiss(this.visite);
}

 confirmStock() {
    let confirm = this.alertCtrl.create({
      title: '<b>Confirmation</b>',
      message: "Confirmez-vous l'etat des stocks?",
        buttons: [

        {
          text: 'Rectifier',
          handler:()=> {           
            console.log('Agree clicked');
          }
        },
        {
          text: 'CONTINUER',
          handler:()=> {           
              this.stape='comment';
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
 mvj() {
    let confirm = this.alertCtrl.create({
      title: '<b>Moyenne de vente par jour</b>',
      message: '<b>Quel est le moyent de vente par jour ?</b>',
    
       inputs: [
        {
          name: 'mvj',
          type: 'number',
          label:'Moyenne de vente',
          placeholder:'Moyenne de vente',
          value: '5'
       
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
            if(data.mvj){
               this.visite.mvj=data.mvj;
            }else
            this.visite.mvj=0;
            console.log('Agree clicked'+data.stockG);
          }
        }
      ]
    });
    confirm.present();
  }

 ecl() {
    let confirm = this.alertCtrl.create({
      title: '<b>Ecart de livraison </b>',
      message: "<b>Quel est l'écart de livraison en jour ?</b>",
    
       inputs: [
        {
          name: 'ecl',
          type: 'number',
          label:'Ecart de livraison',
          placeholder:'Ecart de livraison',
          value: '5'
       
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
            if(data.ecl){
               this.visite.ecl=data.ecl;
            }else
            this.visite.ecl=0;
            console.log('Agree clicked'+data.ecl);
          }
        }
      ]
    });
    confirm.present();
  }

 fp() {
    let confirm = this.alertCtrl.create({
      title: '<b>Fréquence de passage</b>',
      message: "<b>Quel est la fréquence de passage des AC en jour ?</b>",
    
       inputs: [
        {
          name: 'fp',
          type: 'number',
          label:'Fréquence de passage',
          placeholder:'Fréquence de passage',
          value: '5'
       
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
            if(data.fp){
               this.visite.fp=data.fp;
            }else
            this.visite.fp=0;
            console.log('Agree clicked'+data.fp);
          }
        }
      ]
    });
    confirm.present();
  }
   
 stock(situation:any) {
    let confirm = this.alertCtrl.create({
      title: '<b>Relevé de stock</b>',
      subTitle: situation.produit,
      message: '<b>Quantité en détail</b>',
    
       inputs: [
        {
          name: 'stock',
          type: 'number',
          label:'stock en détail',
          placeholder:'stock en détail'
       
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
            if(data.stock)
               situation.stock=data.stock;
             else  
             situation.stock=0;
          
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
