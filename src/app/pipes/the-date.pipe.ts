import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'theDate'
})
export class TheDatePipe implements PipeTransform {

  transform(date: any, args?: any): any {

    moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";
    var date =  moment(date, moment.defaultFormat).toDate()


    var formated = moment(date).format('DD-MM-YYYY');
    return formated;

  }


}
