import { Component } from '@angular/core';
import { NavController ,NavParams , ViewController } from 'ionic-angular';

/*
  Generated class for the Winers page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-winers',
  templateUrl: 'winers.html'
})
export class Winers {
  winers:Array<any>=[];
  gagnant:any={};
  constructor(public navCtrl: NavController, public navParams:NavParams,  public viewCtrl: ViewController) {
     this.winers=navParams.get('winers'); 
  }

  ionViewDidLoad() {
    console.log('Hello Winers Page');
  }
  
 dismiss(data?:any) {   
      this.viewCtrl.dismiss(data);
  } 

add(){
  let winer=Object.assign({}, this.gagnant);
  this.gagnant={};
  this.winers.push(winer);
}

isInvalid():boolean{
return !this.gagnant.nom || !this.gagnant.tel|| !this.gagnant.object;
}

remove(winer:any){
  this.winers.splice(this.winers.indexOf(winer))
}
}
