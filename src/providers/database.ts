import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
/*
  Generated class for the Database provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Database {

  constructor(public http: Http) {
    console.log('Hello Database Provider');
let db = new SQLite();
   db.openDatabase({ name: 'data.db',location: 'default' })
   .then((db: SQLite) => {db.executeSql('create table danceMoves(name VARCHAR(32))', {})
   .then(() => {})
   .catch(() => {});

  })
  .catch(error => console.error('Error opening database', error));
  }

}
