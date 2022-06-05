import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { SnackService } from 'src/app/services/snack.service';
declare var $:any;


@Component({
  selector: 'app-test-select',
  templateUrl: './test-select.component.html',
  styleUrls: ['./test-select.component.scss']
})
export class TestSelectComponent implements OnInit {

  // tests : any = [];;
  key = '';

  row=0
  tests: Observable<any>;
  filter_cat_id = -1
  categories: any = [];
  constructor(public data:DataService,public api : ApiService, private snack:SnackService,
    public router:Router) { }

    @Output() setSelectedTest = new EventEmitter();
    @Input() requestId :any;
    @Input() selectedTests :any;
    @Input() unique ="";



  getCats() {
      this.api.Cats.getCats().subscribe((res) => {
        this.categories = res["data"];
      });
    }

  getTests(res){
    let status = "active"
    let category
    if(this.filter_cat_id == -1){
      category = ''
    }else{
      category = '&category='+this.filter_cat_id
    }
    // $('.dropdown-menu.test').dropdown('show');
    this.tests = this.api.Tests.getTests2(res,null,category,status).pipe(map(res => res['data']),tap(res =>{ console.log(res)
    }));

  }

  add_test_by_enter(){
    let input = document.getElementById('test_autocomplete' )
    this.api.Tests.getTests(input['value'],null).subscribe(res => {

      let test = res['data'].find(one => one.code.toLocaleLowerCase() == input['value']['toLocaleLowerCase']())
      $('.dropdown-menu.test').dropdown('show');

      if(test){
        this.setTest(test)
        input['value'] = ''
      }else {

      }
      // this.snack.showerror('Sorry this code doesn\'t exist')

    })
   }

   changeCat(){
    var input$ : Observable<any> = fromEvent($('#test_autocomplete'  ), 'input');
    input$.pipe(map(res => res['target'].value),debounceTime(500)).subscribe(res => {
      $('.dropdown-menu.test'  ).show();
      this.getTests(res);
    })

   }

  ngOnInit() {

    var input$ : Observable<any> = fromEvent($('#test_autocomplete'  ), 'input');
    input$.pipe(map(res => res['target'].value),debounceTime(500)).subscribe(res => {
      $('.dropdown-menu.test'  ).show();
      this.getTests(res);
    })

    this.getCats()
  }


  hide(){

    $('.dropdown-menu.test'  ).hide();

  }

  setTest(test){
    $('.dropdown-menu.test'  ).hide();
    $('#test_autocomplete'  ).val("");
    let tests_ids = []
    this.selectedTests.forEach(function(test){
      tests_ids.push(test['id'])
    })
    this.api.Tests.checkDevices(test.id, test.isPackage, test.isProfile).subscribe((res) => {
      if(res['errors'] == false){
        // this.api.Tests.checkParameters(test.id, tests_ids).subscribe((res2) => {
        //   if(res2['errors'] == false){
            this.setSelectedTest.emit(test)
            this.row=0;
        //   }else{
        //     this.snack.showerror(res2['errors']);
        //   }  
        // });
      }else{
        this.snack.showerror(res['errors']);
      }
    });
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
    nextTest.setAttribute('id','')
    pressKey=='down'?this.row+=1:this.row-=1
    if((this.row>=rows.length)||(this.row<0)){
      var index=0;
      this.row=0;
    }else{
      var index=this.row;
    }

    let test= rows[index];
    test.setAttribute('class','allRow selectTest')
    test.setAttribute('id','selectTest')
    var element = document.getElementById("selectTest");
    rows[this.row].scrollIntoView({
        // behavior: 'smooth',
        block: 'center'
    });

  }

  enter(){
    let selectTest = document.getElementById("selectTest")
    if(selectTest) selectTest.click();
  }

 

  convertToEnglish(event, searchInput) {
    console.log('keyCode', event.keyCode)
    let currentValue
    if (window.getSelection().toString() != '')
    {
      currentValue = ''
    }else{
      currentValue = $('#test_autocomplete').prop('selectionStart');
    }
    // if( event.keyCode == 1604 && event.keyCode == 1575){
    //     event.preventDefault()
    //     this.setCharAtPlace('b',currentValue,searchInput)
    //     return
    // }
    if( event.keyCode == 1590 ){
      event.preventDefault()
      this.setCharAtPlace('q',currentValue,searchInput)
    }
    if( event.keyCode == 1589 ){
      event.preventDefault()
      this.setCharAtPlace('w',currentValue,searchInput)
    }
    if( event.keyCode == 1579 ){
      event.preventDefault()
      this.setCharAtPlace('e',currentValue,searchInput)
    }
    if( event.keyCode == 1602 ){
      event.preventDefault()
      this.setCharAtPlace('r',currentValue,searchInput)
    }
    if( event.keyCode == 1601 ){
      event.preventDefault()
      this.setCharAtPlace('t',currentValue,searchInput)
    }
    if( event.keyCode == 1594 ){
      event.preventDefault()
      this.setCharAtPlace('y',currentValue,searchInput)
    }
    if( event.keyCode == 1593 ){
      event.preventDefault()
      this.setCharAtPlace('u',currentValue,searchInput)
    }
    if( event.keyCode == 1607 ){
      event.preventDefault()
      this.setCharAtPlace('i',currentValue,searchInput)
    }
    if( event.keyCode == 1582 ){
      event.preventDefault()
      this.setCharAtPlace('o',currentValue,searchInput)
    }
    if( event.keyCode == 1581 ){
      event.preventDefault()
      this.setCharAtPlace('p',currentValue,searchInput)
    }
    if( event.keyCode == 1588 ){
      event.preventDefault()
      this.setCharAtPlace('a',currentValue,searchInput)
    }
    if( event.keyCode == 1587 ){
      event.preventDefault()
      this.setCharAtPlace('s',currentValue,searchInput)
    }
    if( event.keyCode == 1610 ){
      event.preventDefault()
      this.setCharAtPlace('d',currentValue,searchInput)
    }
    if( event.keyCode == 1576 ){
      event.preventDefault()
      this.setCharAtPlace('f',currentValue,searchInput)
    }
    if( event.keyCode == 1604 ){
      event.preventDefault()
      this.setCharAtPlace('g',currentValue,searchInput)
      let currentText = $('#test_autocomplete').val()
      var chars = /gh/gi; 
      var newstr = currentText.replace(chars, "b"); 
      $('#test_autocomplete').val(newstr)
    }
    if( event.keyCode == 1575 ){
      event.preventDefault()
      this.setCharAtPlace('h',currentValue,searchInput)
      let currentText = $('#test_autocomplete').val()
      var chars = /gh/gi; 
      var newstr = currentText.replace(chars, "b"); 
      $('#test_autocomplete').val(newstr)
    }
    if( event.keyCode == 1578 ){
      event.preventDefault()
      this.setCharAtPlace('j',currentValue,searchInput)
    }
    if( event.keyCode == 1606 ){
      event.preventDefault()
      this.setCharAtPlace('k',currentValue,searchInput)
    }
    if( event.keyCode == 1605 ){
      event.preventDefault()
      this.setCharAtPlace('l',currentValue,searchInput)
    }
    if( event.keyCode == 1574 ){
      event.preventDefault()
      this.setCharAtPlace('z',currentValue,searchInput)
    }
    if( event.keyCode == 1569 ){
      event.preventDefault()
      this.setCharAtPlace('x',currentValue,searchInput)
    }
    if( event.keyCode == 1572 ){
      event.preventDefault()
      this.setCharAtPlace('c',currentValue,searchInput)
    }
    if( event.keyCode == 1585 ){
      event.preventDefault()
      this.setCharAtPlace('v',currentValue,searchInput)
    }
    if( event.keyCode == 1609 ){
      event.preventDefault()
      this.setCharAtPlace('n',currentValue,searchInput)
    }
    if( event.keyCode == 1577 ){
      event.preventDefault()
      this.setCharAtPlace('m',currentValue,searchInput)
    }
 } 
 setCharAtPlace(char,currentValue,searchInput){
    if(currentValue != ''){
      var cursorPos = currentValue;
      var v = $('#test_autocomplete').val();
      var textBefore = v.substring(0,  cursorPos);
      var textAfter  = v.substring(cursorPos, v.length);
      $('#test_autocomplete').val(textBefore + char + textAfter);
      var newCursor = +cursorPos + 1
      cursorPos = newCursor
      this.setSelectionRange(searchInput, cursorPos, cursorPos)
      $('.dropdown-menu.test'  ).show();
      this.getTests($('#test_autocomplete').val())
    }else{
      $('#test_autocomplete').val(char)
      $('.dropdown-menu.test'  ).show();
      this.getTests(char)
    }
 }

  setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

}
