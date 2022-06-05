import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'repeat'
})
export class RepeatPipe implements PipeTransform {

  transform(data: any): any {

    switch(data){
      case true : {return "Repeat"; break}
      case false : {return "No repeat"; break}
    }


  }


}
