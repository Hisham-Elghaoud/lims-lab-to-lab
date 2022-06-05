import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ProgressService } from 'src/app/services/progress.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {

  key: any = "";
  profiles: any;
  pagination : any = {};
  selectedProfile: any = {
    test : {
      data : []
    }
  };




  constructor(public router:Router,public api : ApiService,public progress : ProgressService, public data:DataService) { }

  ngOnInit() {

    this.getProfiles("");
  }


  getProfiles(key){

    this.progress.on();


    // $('.dropdown-menu').dropdown('show');
    this.profiles = this.api.Profiles.getProfiles(key).pipe(tap(res => {
    }),map(res => res['data']));

    this.progress.off();


  }


  search(){
    this.getProfiles(this.key)
  }

  setProfile(profile){

    console.log(profile);

    this.selectedProfile = profile
  }


}


