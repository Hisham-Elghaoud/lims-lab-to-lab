import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: any, args?: any): any {

    moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";
    var date =  moment(time, moment.defaultFormat).toDate()
  
    var formated = moment(date).format('hh:mm:ss a');
    return formated;

  }

}
