import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  key: any = '';
  categories: any = [];
  title: any;

  constructor(public data : DataService,private router : Router, public api : ApiService) { }

  ngOnInit() {


    this.title = this.data.getTitle();

    if(sessionStorage.getItem('UserToken') != null){



    }


  }

  //-----------------------------------------------------------------------------------------





  //-----------------------------------------------------------------------------------------

  goto(url){

    this.router.navigateByUrl(url)

  }




}

