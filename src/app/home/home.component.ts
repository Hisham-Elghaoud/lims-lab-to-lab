import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { ProgressService } from '../services/progress.service';
declare var $:any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public data : DataService,private router:Router, private api:ApiService, private progress:ProgressService) { }

  // hover:boolean = false;

  ngOnInit() {

    localStorage.setItem('last_action' , (new Date()).getTime() + "")

    this.router.events.subscribe(events => {
      localStorage.setItem('last_action' , (new Date()).getTime() + "")
    })

    this.api.common.getInfo().subscribe(res => {
      this.data.info = res['data']
      let minutes;
      if(res['data'] && res['data']['settings'] && res['data']['settings']['logout-timer']){
        minutes = res['data']['settings']['logout-timer']
        this.data.logout_intreval = setInterval(()=>{

          let last_action = (new Date(+localStorage.last_action)).getMinutes()
          let nowMins = (new Date()).getMinutes()
          if(nowMins < last_action) nowMins += 60
          let diff = nowMins - last_action
          if(diff == minutes){
              sessionStorage.removeItem('UserToken');
              clearInterval(this.data.logout_intreval)
              location.reload()
          }

        },1000 * 30)
      }
    })


  }


  onDestroy(){
    clearInterval(this.data.logout_intreval)
  }
  }
