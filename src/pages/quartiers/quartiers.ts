import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,AlertController   } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'quartier',
  templateUrl: 'quartiers.html'
})



export class Quartiers {
  queryText = '';
  pointVente:any={};
  newQuartiers:any=[];
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController ,
    public alertCtrl: AlertController,
    public storage: Storage,
    public navParams:NavParams) {
    this.pointVente=navParams.get('pointVente');
    this.storage.get('_quartiers')
        .then((data) =>{ 
         if(data) 
           this.newQuartiers= data;
      } );
     }

  ionViewDidLoad() {
    console.log('Hello SelectPage Page');
  }
search() {
         let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
         this.newQuartiers.forEach(item => {
         item.hide = true;
        this.filter(item, queryWords);
      });

  }

filter(item, queryWords){
let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.id.toLowerCase().indexOf(queryWord) > -1 ) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
     item.hide = !(matchesQueryText );
}


dismiss(selectedItem?:any) {
    this.pointVente.quartier=selectedItem;
       this.viewCtrl.dismiss(selectedItem);
 } 

exist(items, seach):any{
      let item= items.find((item) => {
       return  (item.id==seach.id) ;
      });

 return item;
}

  newQuartier() {
     this.viewCtrl.dismiss();
    let confirm = this.alertCtrl.create({
      title: '<b>Nouveau quartier</b>',
      message: '<b>Créer un quartier dans le secteur</b>',
       inputs: [
        {
          name: 'id',
          type: 'text',
          label:'Nom du quartier',
          placeholder:'Nom du quartier',
       
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
          text: 'Créer',
          handler:  data=> {           
            if(data.id){
             
               data.nonSaved=true;;
               this.pointVente.quartier=data.id;
               if(!this.exist(this.newQuartiers,data)){
               this.newQuartiers.push(data);
               this.storage.set('_quartiers',this.newQuartiers);
               this.storage.set('_quartiers_saved', false);
               console.log(JSON.stringify(this.newQuartiers));}
            }
          }
        }
      ]
    });
    confirm.present();
  }
}
