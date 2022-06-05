import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
declare var moment:any;


@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {


  stats = {
    patients_today : "...",
    // requests_total : "...",
    tests_total : "...",
    requests_today : "..."
  }

  today:any;
  day:any;

  constructor(public api : ApiService, public data:DataService) { }

  ngOnInit() {

    this.today = moment(new Date()).format("D-MM-YYYY")
    this.day = moment(new Date()).format("dddd")



    this.getStats()

  }

  getStats(){
    this.api.common.getStat().subscribe(res => {

      this.stats = res['data']

    })
  }

}
