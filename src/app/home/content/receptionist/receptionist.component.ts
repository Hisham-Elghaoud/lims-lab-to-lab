import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/progress.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Arabic } from "flatpickr/dist/l10n/ar";

declare let moment:any
declare let $:any;

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss']
})
export class ReceptionistComponent implements OnInit {

    total=0;
    rec:any;
    isExcel:boolean = false;
    transaction:boolean = false;
    transactions :any
    request:boolean = false;
    rev:boolean = true
    requests:Array<any> = [];
    pagination:any;
    pagination_transactions:any={};
    action :any = {}
    from = null
    to = null
    from_time = null
    to_time = null
    payment_status = null
    patient_id = {
      0: {
        name: null
      }
    }
    correspondent_id = {
      0: {
        id: null
      }
    }
    id= null
    isTax = false
    patients: any = []
    correspondents: any = []
    withTests = false
    excel = false
    excel2 = false
    dropdownSettings: IDropdownSettings
    dropdownSettings2: IDropdownSettings


    constructor(private activatedRoute:ActivatedRoute, public data:DataService, public router:Router,public api : ApiService,public progress : ProgressService) { }


    change(){
      console.log(this.from , this.to)
    }

    checkTax(){
      this.api.settings.checkTax().subscribe((res) => {
        console.log('checkTax', res);
        this.isTax = res["isTax"];
      });
    }

    getPatients(){
      this.api.Patients.getAllPatients().subscribe(res => {
        console.log('res', res['data'])
        this.patients = res['data']
      })
    }

    ngOnInit() {    
      this.api.common.get_me().subscribe((res) => {
        this.id = res["data"].id;
        this.getReceptionist(res["data"].id,true)
        this.getRequests(res["data"].id,1)
        this.getTransactions(res["data"].id,1)
        console.log('this.id', this.id)
      });
    this.dropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true,
      idField: 'id',
      textField: 'name'
    }
    this.dropdownSettings2 = {
      singleSelection: true,
      allowSearchFilter: true,
      idField: 'name',
      textField: 'name'
    }
    this.api.Correspondents.getCorrespondents().subscribe(res => {
      this.correspondents = res['data']
    });

      this.getPatients()
      this.checkTax()
      console.log(document.getElementById)

      this.from = moment().subtract(7, 'days').format('DD-MM-YYYY')
      this.to = moment().format('DD-MM-YYYY')
      this.from_time = "00:00"
      this.to_time = "23:59"

      // this.activatedRoute.params.subscribe((param:any) => {   
      //   this.id = param.id
      //   this.getReceptionist(param.id,true)
      //   this.getRequests(param.id,1)
      //   this.getTransactions(param.id,1)
      // })

    }

    getReceptionist(id = this.id,init=false){


      // this.progress.on();
      setTimeout(()=>
      this.api.Receptionists.getOne(id,  `?min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}&from_time=${this.from_time}&to_time=${this.to_time}`).pipe(map(res => res['data']),tap(res => {

        this.progress.off();
        this.rec = res
        if(init){

          setTimeout(()=>{

            $("#fromPicker").flatpickr({
            dateFormat: "d-m-Y",
            defaultDate: moment().subtract(7, 'days').format('DD-MM-YYYY'),
            locale: this.data.language == "arabic" ? Arabic : null,
            position: "auto center",
          })



          $("#toPicker").flatpickr({
            dateFormat: "d-m-Y",
            defaultDate: moment().format('DD-MM-YYYY'),
            locale: this.data.language == "arabic" ? Arabic : null,
            position: "auto center",
          })

        }, 0)

        }
        console.log(res)

      })).subscribe(res=>{

      }),0);


    }
    getTransactions(id = this.id, page = 1){

      setTimeout(()=>
        this.api.Receptionists.get_transaction(id, `?page=${page}&min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}&from_time=${this.from_time}&to_time=${this.to_time}`).subscribe(res=>{
        this.transactions = res['data']
        this.total = res['total_transactions']
        this.pagination_transactions = { per_page:res['per_page'], current_page: res['current_page'],total: res['total'] }
      }),0);


    }

    deSelectPatient(){
      this.patient_id = {
        0: {
          name: null
        }
      }
      this.getRequests()
    }

    deSelectCorrespondent(){
      this.correspondent_id = {
        0: {
          id: null
        }
      }
      this.getRequests()
    }

    getRequests(id= this.id, page = 1){
      let withTests = this.withTests == true ? 1 : 0
      let secQuery = '&withTests='+withTests
      if(this.correspondent_id[0]['id'] != null && this.correspondent_id[0]['id'] != 'null'){
        secQuery += '&correspondent='+this.correspondent_id[0]['id']
      }
      if(this.patient_id[0]['name'] != null && this.patient_id[0]['name'] != 'null'){
        secQuery += '&patient='+this.patient_id[0]['name']
      }
      if(this.payment_status != null && this.payment_status != 'null'){
        secQuery += '&payment_status='+this.payment_status
      }
      setTimeout(()=>
        this.api.Receptionists.get_requests(id, `?page=${page}&min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}&from_time=${this.from_time}&to_time=${this.to_time}`+ secQuery).subscribe(res =>{
        this.requests = res['data']
        this.total = res['total']
        this.pagination = { per_page:res['per_page'], current_page: res['current_page'],total: res['total'] }

      })
      ,0)
    }

    print_transaction(id = this.id,init=false){
      let excel2 = this.excel2 == true ? 1 : 0
      setTimeout(()=>
      this.api.Receptionists.print_transaction(id,  `?min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}&from_time=${this.from_time}&to_time=${this.to_time}&excel=${excel2}`).subscribe((res => {

        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
        console.log('hello people')

      })) ,0);

    }

    print_requests_pdf(id = this.id,init=false){
      let withTests = this.withTests == true ? 1 : 0
      let excel = this.excel == true ? 1 : 0
      let secQuery = '&withTests='+withTests+'&excel='+excel
      if(this.correspondent_id[0]['id'] != null && this.correspondent_id[0]['id'] != 'null'){
        secQuery += '&correspondent='+this.correspondent_id[0]['id']
      }
      if(this.patient_id[0]['name'] != null && this.patient_id[0]['name'] != 'null'){
        secQuery += '&patient='+this.patient_id[0]['name']
      }
      if(this.payment_status != null && this.payment_status != 'null'){
        secQuery += '&payment_status='+this.payment_status
      }
      setTimeout(()=>
      this.api.Receptionists.print_requests(id,  `?min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}&from_time=${this.from_time}&to_time=${this.to_time}`+ secQuery).subscribe((res => {

        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
        console.log('hello people')

      })) ,0);

    }

    sendRequest(){
      this.rev?this.getReceptionist():'';
      this.request?this.getRequests():'';
      this.transaction?this.getTransactions():'';
    }

  }


