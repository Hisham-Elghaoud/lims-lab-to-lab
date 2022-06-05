import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
declare var $:any;


@Component({
  selector: 'app-profile-select',
  templateUrl: './profile-select.component.html',
  styleUrls: ['./profile-select.component.scss']
})
export class ProfileSelectComponent implements OnInit {

  // tests : any = [];
  key = '';
  profiles: Observable<any>;

  constructor(public data:DataService,public api : ApiService,
    public router:Router) { }

    @Output() setSelectedProfile = new EventEmitter();
    @Input() requestId :any;





  getProfiles(res){

      // $('.dropdown-menu').dropdown('show');

    this.profiles = this.api.Profiles.getProfiles(res,this.requestId).pipe(map(res => res['data']),tap(res => console.log(res)
    ));

  }


  ngOnInit() {


    var input$ : Observable<any> = fromEvent($('#profile_autocomplete'), 'input');
    input$.pipe(map(res => res['target'].value),debounceTime(500)).subscribe(res => {

      $('.dropdown-menu').show();

      this.getProfiles(res);


      // this.api.Requests.getTest(res).subscribe(res => {
      //   console.log(res);
      //   this.tests = res

      //   console.log(this.tests.length);


      // })

    })



  }


  hide(){

    $('.dropdown-menu').hide();


  }

  set(profile){

    console.log(profile);

    $('.dropdown-menu').hide();
    $('#test_autocomplete').val("");
    this.setSelectedProfile.emit(profile)

    console.log('here');

  }



}
