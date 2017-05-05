import { Component, ViewChild } from '@angular/core';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Journnee } from '../pages/journnee/journnee';
import { Sauvegarde} from '../pages/sauvegarde/sauvegarde';
import { Events,Platform, MenuController, Nav,ModalController,LoadingController,AlertController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Manager} from '../providers/manager';
//import { Diagnostic } from '@ionic-native/diagnostic';
export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

 appPages: PageInterface[] = [
    { title: 'Accueil', component: Home, icon: 'md-home' },
    { title: 'Savegarde', component: Sauvegarde, index: 2, icon: 'md-cloud-upload' },
    
  ];
  // make HelloIonicPage the root (or first) page
   rootPage: any =this.manager.getAuToken()? Home: Login;// Home;
   user_id:any=this.manager.getUserId();
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public manager: Manager,
     public events: Events,
      public alertCtrl: AlertController,
     public loadingCtrl: LoadingController
  ) {
    this.initializeApp();
    

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
     // this.checkLocation();
    });
       this.manager.clearStorage();
   //this.loadData();
     this.listenToEvents();
  
  }

  openPage(page: PageInterface) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }


 listenToEvents() {
    this.events.subscribe('login:success', () => {
     this.loadData();
    });
     this.events.subscribe('error', () => {
      this.alert();
    });   
}


loadData(){
      let loader = this.loadingCtrl.create({});
  
  this.manager.getPointVentes().then(succes=>{
    if(loader)
       loader.dismiss();
  }).then(()=>{
       this.nav.setRoot(Home);
  });
   loader.present();
}


alert() {
    let confirm = this.alertCtrl.create({
      title: 'Connexion',
      message: "Il se peut que votre connexion soit quelques peu pertubée. Veillez réessayer.",
        buttons: [
        {
          text: 'IGNORER',
          handler:()=> {           
            console.log('Agree clicked');
          }
        },
         {
          text: 'Ressayer',
          handler:()=> {           
           this.loadData();
            console.log('Agree clicked');
          }
        }       
      ]
    });
    confirm.present();
  }

/*checkLocation(){
  if(this.platform.is('android'))
    Diagnostic.isLocationEnabled().then( (avail) => {
    console.log(avail);
    if(!avail){
        return Diagnostic.switchToLocationSettings();
   }
  }).catch( (err) => {
     console.log(err);
})
}*/
}
