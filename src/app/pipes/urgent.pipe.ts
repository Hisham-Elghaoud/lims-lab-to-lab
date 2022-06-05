import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'urgent'
})
export class UrgentPipe implements PipeTransform {

  transform(data: any, args?: any): any {

    switch(data){
      case 1 : {return "Urgent"; break}
      case 0 : {return "Normal"; break}
    }


  }


}
