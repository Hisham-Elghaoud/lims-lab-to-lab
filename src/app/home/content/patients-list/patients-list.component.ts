import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { map, tap, debounceTime } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ProgressService } from 'src/app/services/progress.service';
import { DataService } from 'src/app/services/data.service';
declare var $:any;

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit,AfterViewInit {
  key: any = "";
  patients: any;
  pagination : any = {};
  action :any = '';
  isLoaderHidden = true;


  constructor(public router:Router,public api : ApiService,public progress : ProgressService, public data:DataService) { }

  ngOnInit() {

    this.progress.on()
    this.getPatients(this.key,true,1);

  }

  print(id){

    this.api.Patients.print_card(id).subscribe(res => {

      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');

    })
  }

  getPatients(res,paginate,page){


    // $('.dropdown-menu').dropdown('show');
    this.patients = this.api.Patients.getPatients(res,paginate,page).pipe(tap(res => {

      this.pagination = res['meta']['pagination'];
      this.progress.off()
      this.isLoaderHidden = true


    }),map(res => res['data']));

  }


  ngAfterViewInit(){

    var input$ : Observable<any> = fromEvent($('#pat_autocomplete'), 'input');
    input$.pipe(map(res => res['target'].value),debounceTime(500)).subscribe(res => {


      console.log('here');

      this.key = res
      this.isLoaderHidden = false
      this.getPatients(this.key,true,1);



    })

  }

  onPatientCreated(event){

    this.getPatients(this.key,true,1);

    $("#modal").modal('hide');

    // $("#modal").toggle("hide");
    // $('body').removeClass('modal-open');
    // $('.modal-backdrop').remove();
    // $('.dropdown-menu').dropdown('hide');
  }

  search(){
    this.getPatients(this.key,true,1)
  }

  openModal(action){

    this.action = action
    $("#modal").modal('show');

  }



}
