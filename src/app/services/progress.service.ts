import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor() { }

  public showProgress : Boolean = false;
  public showDialogProgress : Boolean = false;

  public on(){
    this.showProgress = true;
  }

  public off(){
    this.showProgress = false;
  }

  public onDP(){
    this.showDialogProgress = true;
  }

  public offDP(){
    this.showDialogProgress = false;
  }
  
}
