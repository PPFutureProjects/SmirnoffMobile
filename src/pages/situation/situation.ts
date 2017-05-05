import { Component } from '@angular/core';
import { NavController,NavParams ,AlertController  , ViewController} from 'ionic-angular';

/*
  Generated class for the Stock page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-situation',
  templateUrl: 'situation.html'
})
export class Situation {
  situation:any
  title:any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,  
    public navParams:NavParams) {
    this.situation=navParams.get('situation'); 
    this.title=navParams.get('title'); 
    }


logic() {
  if(this.situation.enrupture && this.situation.absent)    
     this.situation.enrupture=false;

 if(this.situation.enrupture&& !this.situation.absent)    
        this.situation.absent=false;
if(this.situation.enrupture|| this.situation.absent) {  
        this.situation.price=null;
         this.situation.bnreBlle=null;
        } 
}
    
  ionViewDidLoad() {
    console.log('Hello situation Page');
  }


 isValid():boolean {
    return this.situation.absent || this.situation.enrupture || (this.situation.bnreBlle&&this.situation.price);
           }


  dismiss(data?:any) {
  this.logic();
  
      this.viewCtrl.dismiss(data);
  }  

  bnreBlle() {
    let confirm = this.alertCtrl.create({
      title: '<b>Nombre de bouteilles</b>',
      message: 'Quel est le nombre de bouteilles sur les tables',
    
       inputs: [
        {
          name: 'bnreBlle',
          type: 'number',
          label:'Nombre de bouteilles',
          value:this.situation.bnreBlle,
          placeholder:'Nombre de bouteilles'
       
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
            if(data.bnreBlle){
               this.situation.bnreBlle=data.bnreBlle;
            }else
            this.situation.bnreBlle=0;
            console.log('Agree clicked'+data.bnreBlle);
          }
        }
      ]
    });
    confirm.present();
  }
  nbreRh() {
    let confirm = this.alertCtrl.create({
      title: '<b>Nombre de ressources</b>',
      message: 'Quel est le nombre de ressources',
    
       inputs: [
        {
          name: 'nbreRh',
          type: 'number',
          label:'Nombre de ressources',
          value:this.situation.nbreRh,
          placeholder:'Nombre de ressources'
       
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
            if(data.nbreRh){
               this.situation.nbreRh=data.nbreRh;
            }else
            this.situation.nbreRh=0;
            console.log('Agree clicked'+data.nbreRh);
          }
        }
      ]
    });
    confirm.present();
  }


  price() {
    let confirm = this.alertCtrl.create({
      title: '<b>Prix dans le POS</b>',
      message: "Quel est le prix d'une bouteille",
    
       inputs: [
        {
          name: 'price',
          type: 'number',
          label:'Prix dans le POS',
           value:this.situation.price,
          placeholder:'Prix dans le POS'
       
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
            if(data.price){
               this.situation.price=data.price;
            }else
            this.situation.price=0;
            console.log('Agree clicked'+data.price);
          }
        }
      ]
    });
    confirm.present();
  }    
}
