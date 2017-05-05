import { Injectable } from '@angular/core';
//import { Component } from '@angular/core';
import {  ToastController, ToastOptions } from 'ionic-angular';

@Injectable()
export class AppNotify {

  constructor(
    private toastCtrl: ToastController
  ) {
    this.toastCtrl = toastCtrl;
  }

  onSuccess(toastOpts: ToastOptions) {

    let succesToast = this.toastCtrl.create({
      message: toastOpts.message,
      duration: toastOpts.duration || 3000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      cssClass: 'danger',
    });
    succesToast.present();

  }

  onError(toastOpts: ToastOptions) {

    let errorToast = this.toastCtrl.create({
      message: toastOpts.message,
      duration: toastOpts.duration || 3000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      cssClass: 'success',
    });

    errorToast.present();

  }

}
