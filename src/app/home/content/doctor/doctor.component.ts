import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { map, tap, debounceTime } from 'rxjs/operators';
import { SnackService } from 'src/app/services/snack.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ProgressService } from 'src/app/services/progress.service';
import { DataService } from 'src/app/services/data.service';
declare var $:any;

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  key: any = "";
  doctors: any = []
  pagination : any = {};
  action :any = '';
  isLoaderHidden = true;
  sureState:Boolean = false;


  constructor(public snack:SnackService,private data:DataService, public router:Router,public api : ApiService,public progress : ProgressService) { }

  async ngOnInit() {

    this.progress.on()
   await this.getDoctors(this.key);

  }

  getDoctors(res,paginate?,page?){


    // $('.dropdown-menu').dropdown('show');
     this.api.Doctors.getDoctors(res).subscribe(res => {
      this.doctors = res['data']
      this.progress.off()
      this.isLoaderHidden = true
      console.log(this.doctors );


    });

  }


  ngAfterViewInit(){

    var input$ : Observable<any> = fromEvent($('#pat_autocomplete'), 'input');
    input$.pipe(map(res => res['target'].value),debounceTime(500)).subscribe(res => {


      console.log('here');

      this.key = res
      this.isLoaderHidden = false
      this.getDoctors(this.key,true,1);



    })

  }

  onPatientCreated(event){

    this.getDoctors(this.key,true,1);

    // $("#modal").modal('hide');

    // $("#modal").toggle("hide");
    // $('.modal-backdrop').remove();
    // $('.dropdown-menu').dropdown('hide');
  }

  search(){
    this.getDoctors(this.key,true,1)
  }

  openModal(action){

    this.action = action
    $("#modal").modal('show');

  }
  onSubmit(form){
    var doctor={'name': this.action.name,'phone': this.action.phone,'specialty': this.action.specialty}
    console.log('doctor', doctor)
    switch (this.action.type) {
      case 'Edit':
          this.api.Doctors.editDoctor( this.action.id,doctor).subscribe(res => {
            this.getDoctors(this.key);
            this.action.name=""
            this.action.phone=""
            this.action.specialty=""
            this.snack.show('The doctor was successfully updated');
            $('#modal').modal('hide');
            // $("#modal").toggle();
            // $('#modal').removeClass('show');



          })

        break;
      case 'New':
          this.api.Doctors.createDoctor(doctor).subscribe(res => {
            this.getDoctors(this.key);
            this.action.name=""
            this.action.phone=""
            this.action.specialty=""
            $('#modal').modal('hide');
            this.snack.show('The doctor was successfully added');

            // $("#modal").toggle();
            // $('#modal').removeClass('show');



          })
        break;

      default:
        break;
    }

  }
  remove(id){
    this.api.Doctors.delete(id).subscribe(res => {
      if (res['error']) {
        this.snack.showerror(res['message']);

      }else{
        this.snack.show(res['message']);
        this.getDoctors(this.key);
      this.action.name=""
      // $("#modal").toggle();
      $('#modal').removeClass('show');
      }
    })
  }

}
