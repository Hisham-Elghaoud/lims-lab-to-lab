import { Pipe, PipeTransform } from '@angular/core';
declare var moment:any;

@Pipe({
  name: 'time_left'
})
export class TimeLeftPipe implements PipeTransform {

  transform(date: any, args?: any): any {



    // var GB =  moment(date, moment.defaultFormat).toDate()
    // return this.readableBytes(bytes)

    // var formated = moment(date).format('YYYY-MM-DD');
    return this.daysRemaining(date);

  }

  daysRemaining(date) {
    var eventdate = moment(date);



    var todaysdate = moment();
    return eventdate.diff(todaysdate, 'days');
}



}
