import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import 'print-js';
import * as printJS from 'print-js';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
declare let $;
@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.scss']
})
export class RequestSummaryComponent implements OnInit {

  request: any = {};
  categories: Array<any> = []
  single_sticker:boolean = false;
  total: any;
  remaining: any;
  @Input() patientId: any;
  @Input() request_id: any;

  constructor(public api : ApiService,private route : ActivatedRoute, public data:DataService) { }


  ngOnChanges(changes){

     this.getRequest();
     this.getTotal();
     this.getCategories()

  }

  ngOnInit() {

  }


  categories_select_all(unselect){
    this.categories.forEach(category => {
      let element = document.getElementById('categories\|' + category.id)
      if(element['checked'] == unselect) element.click()
    })
  }


  getCategories(){
    this.api.Requests.getCategories(this.request_id).subscribe(res =>{
      this.categories = res['data']
    })
  }

  getRequest(){
    this.api.Requests.getRequest(this.request_id).subscribe(res =>{
      console.log(res);
      this.request =  res

    })
  }

  print(){

    this.api.Printables.PrintRecieptForZebra(this.request_id).subscribe(
      (response) => {
        //Next callback
        console.log('response received')
      },
      (error) => {
          //Error callback
        console.error('error PrintRecieptForZebra  in component')

        this.api.Printables.PrintReciept(this.request_id).subscribe(res => {

          const fileURL = URL.createObjectURL(res);
          window.open(fileURL, '_blank');

        })
      }
    )
  }

  printBarcode(form :NgForm){


    let categories = Object.keys(form.value).filter(key => form.value[key])
    let query = 'categories[]=' + categories.join("&categories[]=")

    this.api.Printables.PrintBarcodesForZebra(this.request_id, this.single_sticker, query).subscribe(

      (response) => {
        //Next callback
        $('#categories_modal').modal('hide')
      },
      (error) => {
          //Error callback
        this.api.Printables.PrintBarcodes(this.request_id, this.single_sticker, query).subscribe(res => {
          const fileURL = URL.createObjectURL(res);
          window.open(fileURL, '_blank');
          $('#categories_modal').modal('hide')
        })
      }

    )

  }
  detailedInvoice(){

    this.api.Printables.PrintdetailedInvoiceForZebra(this.request_id).subscribe(

      (response) => {
        //Next callback
        console.log('response received')
      },
      (error) => {
          //Error callback
        console.error('error PrintBarcodesForZebra in component')
        this.api.Printables.PrintdetailedInvoice(this.request_id).subscribe(res => {
          const fileURL = URL.createObjectURL(res);
          window.open(fileURL, '_blank');

        })
      }

    )

  }
  getTotal(){
    this.api.Requests.getTotal(this.request_id).subscribe(res =>{
      console.log(res);
      this.total = res['patient_total']
      this.remaining = res['patient_remaining']
    })
  }

}
