import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProgressService } from 'src/app/services/progress.service';
import { DataService } from 'src/app/services/data.service';
declare var $:any


@Component({
  selector: 'app-correspondents-list',
  templateUrl: './correspondents-list.component.html',
  styleUrls: ['./correspondents-list.component.scss']
})
export class CorrespondentsListComponent implements OnInit {
  correspondents: Observable<any>;
  action :any = {}


  constructor(public router:Router,public api : ApiService,public progress : ProgressService, public data:DataService) { }

  ngOnInit() {
    this.getCorrespondents();
  }


  getCorrespondents(){

    // $('.dropdown-menu').dropdown('show');
    this.progress.on();

    this.correspondents = this.api.Correspondents.getCorrespondents().pipe(map(res => res['data']),tap(res => {

      this.progress.off();

      console.log(res)

    }));


  }

  openModal(action){

    this.action = action
    $("#cor-modal").modal('show');

  }



  correspondentCreated(){
    console.log('here');

    this.getCorrespondents();
    $("#cor-modal").modal('hide');
  }




}
