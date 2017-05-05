import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,AlertController   } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'rh',
  templateUrl: 'rh.html'
})

export class Rh {
  queryText = '';
  rapport:any={};
  rhs:any=[];
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController ,
    public alertCtrl: AlertController,
    public storage: Storage,
    public navParams:NavParams) {
    this.rapport=navParams.get('rapport');
     this.storage.get('_rhs')
        .then((data) =>{ 
           console.log(data);
         if(data) 
           this.rhs= data;
      } );
     }

  ionViewDidLoad() {
    console.log('Hello SelectPage Page');
  }

search() {
         let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
         this.rhs.forEach(item => {
         item.hide = true;
        this.filter(item, queryWords);
      });

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

dismiss(selectedItem?:any) {
    this.viewCtrl.dismiss(selectedItem);

 } 

}
