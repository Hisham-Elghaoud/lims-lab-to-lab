import { Injectable } from '@angular/core';
import { LocalePipe } from '../pipes/locale.pipe';
declare var Snackbar:any;

@Injectable({
  providedIn: 'root'
})
export class SnackService {


  constructor( private localePipe:LocalePipe) { }

  show(text,duration?){

       Snackbar.show({text: this.localePipe.transform(text),pos : 'top-center' ,showAction: false,duration :duration || 3000
      ,backgroundColor : '#d6e8d8'});

  }

  showerror(text,duration?){

       Snackbar.show({text: this.localePipe.transform(text),pos : 'top-center' ,showAction: false,duration : duration || 3000
      ,backgroundColor : '#e8d6d6'});

  }

  warning(text,duration?){

     Snackbar.show({text: this.localePipe.transform(text),pos : 'top-center' ,showAction: false,duration : duration || 3000
    ,backgroundColor : '#FFC107dd'});

}

}
