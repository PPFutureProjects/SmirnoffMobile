import { Component } from '@angular/core';
import { NavController ,LoadingController} from 'ionic-angular';
import { Manager} from '../../providers/manager';
import {AppNotify} from '../../app/app-notify';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
credentials:any={};
  constructor(public navCtrl: NavController,public manager:Manager,public appNotify: AppNotify, public loadingCtrl: LoadingController,) {}

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

isInvalid(){
  return !this.credentials.login;
}

onSubmit(){
  let loader = this.loadingCtrl.create({
      content: "Connexion...",
      duration: 8000
    });
   
 this.manager.authenticate(this.credentials).then(res=>{
  if(res){
     loader.dismiss();
     this.appNotify.onSuccess({message:'Vous êtes authentifié',showCloseButton:false});
  }
 else
    this.appNotify.onError({message:"Vous n'êtes authentifié reéssaye svp",showCloseButton:true});
}); 
  loader.present();
}
}
