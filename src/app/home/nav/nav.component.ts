import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {



  constructor(public data : DataService) { }

  ngOnInit() {


    $('#sidebarCollapse').on('click',  () => {
      $('#sidebar').toggleClass('active');
    });

    if($(window).width() > 768){
      $('#sidebar').hover(  () => {

        this.hover()

      });
    }

    if($(window).width() < 768){

      this.data.sidebarStatus = false

    }

    $( window ).resize(()=>{

        if($(window).width() > 768){

          $('#sidebar').addClass('active');
          $('#content').width('calc(100% - 120px)');
          this.data.sidebarStatus = true

          $('#sidebar').hover(  () => {

            this.hover()

           });

        }

        else

        if($(window).width() < 768){

          $('#content').width('100%');
          $('#sidebar').addClass('active');
          this.data.sidebarStatus = false

          $('#sidebar').off('mouseenter mouseleave');

        }

      })

  }

  hover(){
    switch (this.data.sidebarStatus) {
      case true:{
        this.data.sidebarStatus = false
        $('#sidebar').removeClass('active')
        break;
      }

      case false:{
        this.data.sidebarStatus = true
        $('#sidebar').addClass('active')
        break;
      }
    }
  }

}
