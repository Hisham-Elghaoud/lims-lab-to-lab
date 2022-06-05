import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lims';
  prevent_viewing:boolean = false;


  constructor(public api : ApiService, public data:DataService) { }

  ngOnInit() {



    this.data.reload.subscribe(one => {
      this.prevent_viewing = true;
      this.data.prevent_viewing = true
      setTimeout(()=>{
        this.prevent_viewing = false
        this.data.prevent_viewing = false
      }, 0)
  })

    // this.api.common.refresh().subscribe(res => {

    //   sessionStorage.setItem('UserToken',res['access_token']);


    // },err=> {

    //   switch(err.status){
    //     case 401 : break;
    //   }

    // });

  }


}
