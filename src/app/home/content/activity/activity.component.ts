import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
declare let $;
declare let moment;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  constructor(public router:Router,private api:ApiService,private data:DataService) { }

  activity$:Observable<any>;
  from = null
  to = null

  activity_log(){
    this.activity$ = this.api.activity.get(document.getElementById('code')['value'])
  }

  print(){
    this.api.activity.print(`?min_date=${this.from.split("-").reverse().join('-')}&max_date=${this.to.split("-").reverse().join('-')}`).subscribe(res => {
      const fileURL = URL.createObjectURL(res);

      window.open(fileURL, '_blank');
    })
  }
  //
  ngOnInit() {


    this.from = moment().subtract(7, 'days').format('DD-MM-YYYY')
    this.to = moment().format('DD-MM-YYYY')
  }

  ngAfterViewInit(){

    if(this.data.activity_log_request_id_stored){
      document.getElementById('code')['value'] = this.data.activity_log_request_id_stored;
        this.activity_log();
        this.data.activity_log_request_id_stored = "";
    }

    setTimeout(()=>{

      $("#fromPicker").flatpickr({
      dateFormat: "d-m-Y",
      defaultDate: moment().subtract(7, 'days').format('DD-MM-YYYY'),
    })



    $("#toPicker").flatpickr({
      dateFormat: "d-m-Y",
      defaultDate: moment().format('DD-MM-YYYY'),
    })

  }, 0)
  }

}
