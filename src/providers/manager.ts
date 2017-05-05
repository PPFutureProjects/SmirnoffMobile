import { Injectable } from '@angular/core';
import { Http ,Headers, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import {DatePipe} from "@angular/common";
@Injectable()
export class Manager {
 private headers = new Headers({'Content-Type': 'application/json'});
 date:any;
 baseUrl:string='http://guinness.herokuapp.com/v1/mobile';
  constructor(public http: Http ,public storage: Storage,public events: Events) {
    console.log('Hello Manager Provider');
     let nowDate=new Date();
      var datePipe = new DatePipe('en');
      this. date=datePipe.transform(nowDate, 'yyyy-MM-dd');
  }
storeUserCredentials(token) {
        window.localStorage.setItem('_token', token);
    }
  clearStorage() {
   //this.storage.clear();
   //window.localStorage.clear();
        
    }
  storeUser(user:any) {
      window.localStorage.setItem('_user_id', user.id);
      window.localStorage.setItem('_user_region', user.ville);
        
    }
    
getUserId():string{
	let _user_id = window.localStorage.getItem('_user_id');
	return _user_id;
}

getUserVille():string{
	let _user_region = window.localStorage.getItem('_user_region');
	return _user_region;
}
isNotTodaySynchronised():any{
	      let isNotTodaySynchronised = window.localStorage.getItem(this.date);
	return true;
}

setTodaySynchronised(){
	    window.localStorage.setItem(this.date,'yes');
}

getAuToken():string{
	let token = window.localStorage.getItem('_token');
	return token;
}

 getPointVentes() {
  return this.http.get(this.baseUrl+'/points/ventes', { headers:this. headers })
              .toPromise()
               .then(response =>{
                 let pointVentes=response.json();
                 this.updatePointVenteList( pointVentes).then(()=>{
                       this.events.publish('load:success');
                 });
                 }
                 )
               .then(()=>{
                  return  this.getRhs()})
                .then(()=>{
                  return this.getQuartiers()})
                .then(()=>{
                     this. setTodaySynchronised();
                      })
                .catch(error=>{
                 this.events.publish('error');
                 return false;
         });
    }

 getRhs() {
   return  this.http.get(this.baseUrl+'/rhs', { headers:this. headers })
              .toPromise()
               .then(response =>{
                 this.storage.set('_rhs', response.json());
                 return true;
                 }
            );
  }    
 getQuartiers() {
    let _quartiers_loaded=true;
  return this.storage.get('_quartiers_loaded').then((data) =>{ 
           _quartiers_loaded=data;
          }).then(()=>{
    if(!_quartiers_loaded)
     this.http.get(this.baseUrl+'/quartiers', { headers:this. headers })
              .toPromise()
               .then(response =>{
                 this.storage.set('_quartiers', response.json());
                 return true;
                 }
            );
        });
      }
updatePointVenteList(pointVentes:Array<any>){
  var datePipe = new DatePipe('en');    
     pointVentes.forEach(element => {
    let  date=datePipe.transform(element.lastvisitedate, 'yyyy-MM-dd');
    this.storage.set(element.id+'-'+date, date);
          });
  let oldPointVentes=[];
   return this.storage.get('_pointVentes').then((data) =>{ 
        if(data){
           oldPointVentes=data.filter((pointVente)=> { 
              return pointVente.nonSaved;
          });
      
        }
      } ).then(()=>{
           pointVentes.push.apply(pointVentes,oldPointVentes);      
         return this.storage.set('_pointVentes', pointVentes);
      });
}  


 getPointVentesTest() { 
  return this.http.get('assets/data/pointVentes.json', { headers:this. headers })
              .toPromise()
               .then(response =>{
                let pointVentes=response.json();
                 this.updatePointVenteList( pointVentes).then(()=>{
                       this.events.publish('load:success');
                 });
                 }
                 )
               .then(()=>{
                  return  this.getRhsTest()})
               .then(()=>{
                  return this.getQuartiersTest() } )
                .then(()=>{
                     this. setTodaySynchronised();
                }) 
               .catch(error=>{
                 this.events.publish('error');
                 return false;
         });
    }

 getQuartiersTest(load:any=true) {
   let _quartiers_loaded=true;
  return this.storage.get('_quartiers_loaded').then((data) =>{ 
           _quartiers_loaded=data;
          }).then(()=>{
    if(!_quartiers_loaded)
     this.http.get('assets/data/quartiers.json', { headers:this. headers })
              .toPromise()
               .then(response =>{
                 this.storage.set('_quartiers', response.json());
                  this.storage.set('_quartiers_loaded', true);
                 return true;
                 }
            );
          });

        }
 getRhsTest(load:any=true) {
    if(!load)
      return;  
   return  this.http.get('assets/data/rhs.json', { headers:this. headers })
              .toPromise()
               .then(response =>{
                 this.storage.set('_rhs', response.json());
                 return true;
                 }
       );    
  }   
authenticate(credentials: any) {
  console.log(credentials);
         return  this.http.post(this.baseUrl+'/create/auth-token', JSON.stringify(credentials), { headers:this. headers })
              .toPromise()
               .then(response => { 
                    if(response){               
                    this.storeUserCredentials(response.json().value);
                    this.storeUser(response.json().user);
                    this.events.publish('login:success');
                    } else
                    this.events.publish('login:error');
                    return true;
              })
                .catch(error => {
                this.events.publish('login:error');  
                return false;
         })
    
    }
authenticateTest(credentials: any) {
  console.log(credentials);
         return  this.http.get('assets/data/auth.json', { headers:this. headers })
              .toPromise()
               .then(response => { 
                    if(response){               
                    this.storeUserCredentials(response.json().value);
                    this.storeUser(response.json().user);
                    this.events.publish('login:success');
                    } else
                    this.events.publish('login:error');
                    return true;
              })
                .catch(error => {
                this.events.publish('login:error');  
                return false;
         })
    
    }
asynchTest(synchro: any) {
  //console.log(JSON.stringify(synchro));
         return  this.http.get('assets/data/async.json', { headers:this. headers })
              .toPromise()
               .then(response => { 
                    if(response.json().success){               
                    this.events.publish('symchro:success');
                     return true;
                    } else
                       this.events.publish('symchro:failed');
                    return false;
              }).then(()=>{
              this.getPointVentesTest();
              }
              )
                .catch(error => {
                  this.events.publish('symchro:error');  
                return false;
         })
    
    } 

  asynch(synchro: any) {
  //console.log(JSON.stringify(synchro));
         return  this.http.post(this.baseUrl+'/create/points/ventes', JSON.stringify(synchro), { headers:this. headers })
              .toPromise()
               .then(response => { 
                    if(response.json().success){               
                    this.events.publish('symchro:success');
                     return true;
                    } else
                       this.events.publish('symchro:failed');
                    return false;
              }).then(()=>{
                  this.getPointVentes();
              }
              )
                .catch(error => {
                  this.events.publish('symchro:error');  
                return false;
         })
    
    }     
}
