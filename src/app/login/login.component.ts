import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SnackService } from '../services/snack.service';
declare var $:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  email:any = "";
  password:any = "";
  productId: any = '';


  constructor(public api : ApiService,private router : Router,private data : DataService,
    public snack : SnackService) { }


  // constructor(public api : ApiService,private router : Router,private data : DataService,
  // public snack : SnackService) { }


  ngOnInit() {

  }

  //-----------------------------------------------------------------------------------------

  // ngAfterViewInit(){

  //   $('body').css('background-color', '#f2f2f2');

  // }

  //-----------------------------------------------------------------------------------------

  onSubmit(form){




    if(form.valid){

      this.api.common.login(form.value).subscribe(res => {


        if (res['error'] == false ){

          sessionStorage.setItem('UserToken',res['token']);
          sessionStorage.setItem('userName',res['userName']);
          sessionStorage.setItem('userRole',res['role']);
          sessionStorage.setItem('userId',res['id']);
          this.data.user=res
                this.router.navigateByUrl('/');
        }


        else if (res['error'] == true) {

          this.snack.showerror('Please check you credentials and try again');

        }


      },err => {

        console.log(err);
        if(err.status == 401){
          this.snack.showerror('Please check you credentials and try again');
        }

      })


    }

    else {

      this.snack.showerror('Please check you credentials and try again');


    }




  }

}
