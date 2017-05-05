import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Journnee } from '../pages/journnee/journnee';
import { Sauvegarde} from '../pages/sauvegarde/sauvegarde';
import { Rapport } from '../pages/rapport/rapport';
import { Situation } from '../pages/situation/situation';
import { Merchandising } from '../pages/merchandising/merchandising';
import { Winers } from '../pages/winers/winers';
import { Quartiers } from '../pages/quartiers/quartiers';
import { Rh } from '../pages/rh/rh';
import { PointVente} from '../pages/point-vente/point-vente';
import { Manager} from '../providers/manager';
import { HttpModule }    from '@angular/http';
import { Storage } from '@ionic/storage';
import {AppNotify} from './app-notify';

let pages=[
    MyApp,
    Home,
    Login,
    Journnee,
    Rapport,
    Journnee,
    PointVente,
    Sauvegarde,
    Quartiers,
    Situation,
    Winers,
    Rh,
    Merchandising
    
  ];
@NgModule({
  declarations:pages,
  imports: [
    IonicModule.forRoot(MyApp),
     HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [Manager,Storage,AppNotify]
})
export class AppModule {}
