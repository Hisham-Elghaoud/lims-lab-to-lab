import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'result_status'
})
export class ResultStatusPipe implements PipeTransform {

  transform(result: any, args?: any): any {

    switch (result) {
      case 'active': return 'Active'
      break;

      case 'in progress': return 'In Progress'
      break;

      case 'unfinished': return 'In Progress'
      break;

      case 'completed': return 'In Progress'
      break;

      case 'partially validated': return 'In Progress'
      break;

      case 'technically validated': return 'Ready'
      break;


    }

  }


}
