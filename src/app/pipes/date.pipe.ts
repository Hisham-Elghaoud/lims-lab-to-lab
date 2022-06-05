import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(date: any, type = '', args?: any): any {

    let format = null
    if(type == 'full') format = 'YYYY-MM-DD  h:mm a'
    if(type == 'time')  format = 'hh:mm a'

    moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";
    // var date =  moment(date, moment.defaultFormat).toDate()


    var formated = moment(date).format(format || 'DD-MM-YYYY');
    return formated;

  }


}
