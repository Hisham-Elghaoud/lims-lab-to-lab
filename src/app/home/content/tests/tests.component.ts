import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/progress.service';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SnackService } from 'src/app/services/snack.service';
import {debounce} from 'lodash'
declare var $:any

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit, AfterViewInit {
  tests: any[] = [];
  pricings: any[] = [];
  selectedTests = []
  action: any = {}
  isLoaderHidden = true;
  total: number = 0;
  pricing_id: number = 0
  key: any = '';
  // pricings:Array<any> = []

  current_role: string = "admin";
  base: string = this.api.ng_url;
  roles: Array<any> = [];
  urls = {
    admin: "admin",
    receptionist: "res",
    technician: "tec",
  };


  navigate(role) {
    window.open(this.base + this.urls[role], "_blank");
  }




  constructor(public router:Router,public api : ApiService,public progress : ProgressService,public data:DataService,private snack:SnackService) {
    this.setSelectedTest = debounce(this.setSelectedTest, 100)
  }

  ngOnInit() {

    this.api.common.get_me().subscribe((res) => {
      this.roles = res["data"].roles;
    });
    this.api.Pricing.getPricing().subscribe((res) => {
      this.pricings = res["data"];

    });

    this.api.Pricing.getPricing().subscribe(res => {
      this.pricings = res['data']
    })

    this.progress.on();
    this.getTests(this.key);



  }
  onChange(newValue) {
    // this.progress.on();
    this.tests = [];
    this.getTests(this.key, newValue);

  }
  ngAfterViewInit() {

    var input$: Observable<any> = fromEvent($('#test_autocomplete'), 'input');
    input$.pipe(map(res => res['target'].value), debounceTime(500)).subscribe(res => {



      this.key = res
      this.isLoaderHidden = false
      this.getTests(this.key);

    })

  }

  setSelectedTest(test){
    if(this.selectedTests.find(one => one.code == test.id)) return this.snack.showerror('test is already selected')
    this.selectedTests.unshift(test)
    // console.log(this.selectedTests.unshift(test));
    this.total = this.selectedTests.reduce((acc, ele) => acc += (ele.amount || 0), 0)
  }

  removetest(index) {
    this.selectedTests.splice(index, 1)
    this.total = this.selectedTests.reduce((acc, ele) => acc += (ele.amount || 0), 0)
  }

  getTests(key, pricing_id: number = 1) {

    // $('.dropdown-menu').dropdown('show');

    this.api.Tests.getTests(key, pricing_id).pipe(map(res => res['data']), tap(res => {

      this.progress.off();
      this.isLoaderHidden = true

      this.tests = res
      this.selectedTests.map(one => {
        one['amount'] = this.tests.find(test => test.id == one.id)['amount']
      })
      this.total = this.selectedTests.reduce((acc, ele) => acc += (ele.amount || 0), 0)
    })).subscribe();
  }

  openModal(action) {

    this.action = action
    $(`#${action.isProfile ? 'profile' : 'test'}-modal`).modal('show');

  }

  testCreated() {
    this.getTests(this.key);
    $("#test-modal").modal('hide');
    $("#profile-modal").modal('hide');
  }

}
