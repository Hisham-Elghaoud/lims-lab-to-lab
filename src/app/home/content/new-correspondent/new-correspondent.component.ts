import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SnackService } from 'src/app/services/snack.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { ProgressService } from 'src/app/services/progress.service';
declare var $:any;


@Component({
  selector: 'app-new-correspondent',
  templateUrl: './new-correspondent.component.html',
  styleUrls: ['./new-correspondent.component.scss']
})
export class NewCorrespondentComponent implements OnInit,OnChanges{


  @Output() setCreated = new EventEmitter();


  correspondent: any = {

    phone_number:'',
    pricing_id:'',
    code :'',
    name:''

  };


  @Input() action :any;
  pricing: any = [];


    constructor(public api : ApiService,public snack:SnackService,private router : Router,
      public progress : ProgressService) { }

    ngOnInit() {

      this.getData()

    }


    getData(){


      this.getPricing().subscribe(res => {

      })


    }


    getPricing(){


      return this.api.Pricing.getPricing().pipe(map(res => res['data']),tap(res => {

        this.pricing = res

      }))


    }



    onSubmit(form){

      if(form.valid){


         // switch between creating and editing
        switch(this.action['type']){
          case 'New' : {


            this.api.Correspondents.createCorrespondent(form.value).subscribe(res => {

              if(!res['error']){

                this.snack.show('The correspondent was successfully added');


                this.setCreated.emit(res['correspondent_id'])


              }
              else{
                this.snack.showerror('Something went wrong');

              }

            })


            break;
          }

          case 'Edit' : {



            this.api.Correspondents.editCorrespondent(this.correspondent.id , form.value).subscribe(res => {

              console.log(res);

              if(res['error'] !=  true){

                this.snack.show('The correspondent was successfully updated');
                this.setCreated.emit(res)
              }

            })

            break;
          }
        }

      } else {

        this.snack.showerror('Please enter all data correctly and try again');

      }

    }

    ngOnChanges(changes){

      this.progress.onDP();

      console.log(changes);


      if (changes.action.currentValue.type != null) {

        let type = changes.action.currentValue.type
        console.log(type);

        this.setCorrespondentIfAvaliable(type)

      }

    }

    setCorrespondentIfAvaliable(type){


        switch(type){
          case 'New' : {

            this.correspondent = {}
            this.progress.offDP();

            break;
          }
          case 'Edit' : {
            this.api.Correspondents.getCorrespondent(this.action['id']).subscribe(res =>{

              this.correspondent = res['data']
              this.progress.offDP();

            })
            break;
          }
        }





    }






    // createRequest(correspondent_id){


    //   this.api.Requests.createIntialRequest(correspondent_id).subscribe(res => {


    //     if (res['error'] == false ){

    //       this.router.navigateByUrl(`/correspondents/${correspondent_id}/requests/${res['request_id']}/add`);
    //       console.log('here');

    //       $("#modal").toggle("hide");
    //       $('body').removeClass('modal-open');
    //       $('.modal-backdrop').remove();
    //       $('.dropdown-menu').dropdown('hide');

    //     }
    //     else {

    //       this.snack.showerror('something went wrong');

    //     }


    //   })

    // }






    // }


  }



