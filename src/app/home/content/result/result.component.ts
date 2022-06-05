import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  request_id: any;
  reception_number: any;
  @Input() request;
  tests: any[] = [];
  profiles: any[] = [];
  result: Object;
  devices:Boolean=false;
  areas:Boolean=false;
  user_roles: any = []

  constructor(public api:ApiService, public route:ActivatedRoute,public snack : SnackService) { }

  ngOnInit() {


    this.api.common.getPermissions().subscribe(res => {
      var len = Object.keys(res).length
      for (let index = 1; index <= len; index++) {
        this.user_roles.push(res[index])
      }
      // this.user_roles = ['tests']
    })

    this.api.common.getInfo().subscribe(res => {
      console.log(res)
      if(res['data'] && res['data']['settings'] && res['data']['settings']['pdf'] && res['data']['settings']['pdf']['results']){
        let results = res['data']['settings']['pdf']['results']
        console.log(results)
        this.devices = results['withDevices'] || false
        this.areas = results['withAreas'] || false
      }})

    this.route.params.subscribe(params => {


      this.request_id = params['request_id'];


      this.getResults(this.request_id)

    });

      this.api.Casa.getResNum(this.request_id).subscribe(res => {
        console.log('getResNum',res)
        this.reception_number = res['reception_number']
      })

  }

  // printCasa(loc = null){
  //   this.api.Printables.PrintCasa(loc).subscribe(res => {

  //     const fileURL = URL.createObjectURL(res);
  //     window.open(fileURL, '_blank');

  //   })
  // }
   printCasa(requestID, testID,receptionNumber) {
    // console.log(loc);

    this.api.Printables.PrintCasa(requestID,testID).subscribe((res) => {
      console.log('res', res)
      const fileURL =  this.api.base_print_report + '/' + receptionNumber + '/' + res['location'];
      window.open(fileURL, "_blank");
    });
  }

  getResults(requestId){
    this.api.Results.getRequestResults(requestId).subscribe(res => {
      this.tests = res['tests']['data']
      // this.profiles = res['profiles']['data']
      this.result = res
    } )
  }

  isArray(d){
    return Array.isArray(d)
  }

  print(form:NgForm){

    let entities = Object.entries(form.value)

    let query = entities.length? '?' : ''
    entities.filter(one => one[1]).forEach(one => query += `tests_ids[]=${one[0]}&`)


    this.api.Printables.PrintResultForZebra(this.request_id, this.devices,this.areas, query).subscribe(
      (response) => {
        //Next callback
        console.log('response received')
      },
      (error) => {
          //Error callback
        console.error('error caught in component',error)
        this.api.Printables.PrintResult(this.request_id, this.devices,this.areas, query).subscribe(res => {

          const fileURL = URL.createObjectURL(res);
          window.open(fileURL, '_blank');

        })
      }
    )
  }

  setDelivered(){
    this.api.Requests.setDeliverd(this.request_id).subscribe(res => {
      if(!res['error']){
        this.getResults(this.request_id)
        this.snack.show('The request has been set to delivered')
      }
    })
  }



}
