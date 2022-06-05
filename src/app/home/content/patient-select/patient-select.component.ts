import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { SnackService } from 'src/app/services/snack.service';
import { ProgressService } from 'src/app/services/progress.service';
import {debounce} from'lodash';
declare var $:any;


@Component({
  selector: 'app-patient-select',
  templateUrl: './patient-select.component.html',
  styleUrls: ['./patient-select.component.scss']
})
export class PatientSelectComponent implements OnInit {

  tests : any = [];
  key = '';
  patients: Observable<any>;

  @Output() setSelectedPatient = new EventEmitter();


  constructor(public data:DataService,public api : ApiService,
    public router:Router,public snack : SnackService,public progress : ProgressService) {
      this.onChange = debounce(this.onChange , 200)
     }





  getPatients(res){

      // $('.dropdown-menu').dropdown('show');

    this.patients = this.api.Patients.getPatients(res,1,false).pipe(map(res => res['data']),tap(res => console.log(res)
    ));

  }

  getTests(res){

    this.patients = this.api.Patients.getTest(res).pipe(tap(res => console.log(res)
    ));

  }


  onChange(key){
    $('.dropdown-menu.patient').show();
    this.getPatients(key);
  }


  ngOnInit() {


    // var input$ : Observable<any> = fromEvent($('#patient_autocomplete'), 'input');
    // input$.pipe(map(res => res['target'].value),debounceTime(500),distinctUntilChanged()).subscribe(res => {

    //   $('.dropdown-menu.patient').dropdown('show');

    //   this.getPatients(res);


    //   // this.api.Requests.getTest(res).subscribe(res => {
    //   //   console.log(res);
    //   //   this.tests = res

    //   //   console.log(this.tests.length);


    //   // })

    // })



  }


  hide(){
    console.log('problem')
      $('.dropdown-menu.patient').hide();


  }

  create(patient){

    this.api.Requests.createIntialRequest(patient.id).subscribe(res => {


      if (res['error'] == false ){

        this.router.navigateByUrl(`/patients/${patient.id}/requests/${res['request_id']}/add`);
        console.log('here');
        this.key = '';
        $("#modal").toggle("hide");
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('.dropdown-menu').dropdown('hide');

      }
      else {

        this.snack.showerror('something went wrong');

      }


    })






  }


  pick(patient){
    $('#patient_autocomplete').val("");
    $('.dropdown-menu.patient').hide();
    this.setSelectedPatient.emit(patient)
  }


}
