import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { map, tap, debounceTime } from 'rxjs/operators';
declare var $:any


@Component({
  selector: 'app-item-select',
  templateUrl: './item-select.component.html',
  styleUrls: ['./item-select.component.scss']
})
export class ItemSelectComponent implements OnInit {


  // items : any = [];;
  @Input() group = false
  @Input() no_label = false
  @Input() top = null
  @Input() array = null
  key = '';
  filter;
  by_name:boolean = false
  @Input() is_paginated:boolean = true
  filtered_items: Observable<any>;
  items: Observable<any>;
  arr = Array
  @Input() title =""
  @Input() label =""
  row:number=0;
  unique:string = ''
  selectedDatum:any = null
  Params: any [] = [];
  headers:any[] = []
  values:any[] = []
  inputs = {}
  route:any = ""
  action :any = {}
  page : any = 1
  pagination: any ;
  isLoaderHidden = true;

  constructor(public data:DataService,public api : ApiService,
    public router:Router) { }

    @Output() setSelectedItem = new EventEmitter();


  getItems(value){


    this.array? this.items = of(this.array) :
    this.items = this.api.get(this.route + (this.by_name? '?name=':'?code=') + value).pipe(map(res => this.filter? this.filter(res['data']) : res['data']));

    // $('.item-dropdown-menu' + this.route).dropdown('show');


  }


  change({value}){
    this.row=0;
    $('.item-dropdown-menu-' + this.route + this.unique).show();
    console.log('change ==================>',value);
    if(this.is_paginated) this.getItems(value)
    else this.filtered_items = this.items.pipe(map(one => one.filter(obj => obj.code.toLocaleLowerCase().includes(value.toLocaleLowerCase()))))
  }

  ngOnInit() {
    if(this.title == 'tests'){
      // this.label = 'Device'
      this.headers = ['Name']
      this.values = ['name',]
      this.route = 'tests'
    }else if(this.title == 'parameters'){
      // this.label = 'Device'
      this.headers = ['Name']
      this.values = ['name',]
      this.route = 'parameters'
    }else if(this.title == 'doctors'){
      // this.label = 'Device'
      this.headers = ['Name']
      this.values = ['name',]
      this.by_name = true
      this.route = 'doctors'
    }
    if(!this.is_paginated) this.getItems("")


  }


  hide(){

    $('.item-dropdown-menu-' + this.route + this.unique).hide();

  }

  setItem(item){


    // console.log(item);


    $('.item-dropdown-menu-' + this.route + this.unique).hide();
    $('#item_autocomplete-' + this.route + this.unique).val("");
    this.setSelectedItem.emit(item)




  }

  shiftFocusDown(){
  this.selectTestFromTable('down');
  }
  shiftFocusUp(){
  this.selectTestFromTable('up');
  }
  selectTestFromTable(pressKey){
    let rows= document.querySelectorAll('.allRow')
    let nextTest= rows[this.row];
    nextTest.setAttribute('class','allRow ')
    nextTest.setAttribute('id','selectTest')
    pressKey=='down'?this.row+=1:this.row-=1
    if((this.row>=rows.length)||(this.row<0)){
      var index=0;
      this.row=0;
    }else{
      var index=this.row;
    }



    let test= rows[index];
    // console.log('row----',this.row,'next>>>>',next,'last>>>>',last,'index!!!!',index,'input>>',test);

    test.setAttribute('class','allRow selectTest')
    test.setAttribute('id','selectTest')
    test.scrollIntoView();
  }
  enter(){
    document.getElementById("selectTest").click();
  }

}
