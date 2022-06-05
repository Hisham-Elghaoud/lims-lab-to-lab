import { Pipe, PipeTransform } from '@angular/core';
declare let moment

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  constructor(){

  }

  transform(value,options:{slashes:boolean,format?:string}={slashes:false,format:'DD-MM-YYYY'}, args?: any): any {

    if(!value) return

    if(options.slashes){
      value = value.split('/').reverse().join('-')
    }
    let date = value
    if (date) {
        date = new Date(date)
        const seconds = Math.floor((+new Date() - +date) / 1000);
        const intervals = {
            'years': 31536000,
            'months': 2592000,
            // 'w': 604800,
            'days': 86400,
            'hours': 3600,
            'minutes': 60,
            'seconds': 1
        };
        let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0 ){
              // if (counter === 1) {
                return [counter,i,value.split('-').reverse().join('-')]; // singular (1 day ago)
                // return counter + ' ' + i ; // singular (1 day ago)
                // }
                // else {
                //     return counter + ' ' + i + 's'; // plural (2 days ago)
                // }
            }
                // if (counter === 1) {
                //     return counter + ' ' + i + ' ago'; // singular (1 day ago)
                // } else {
                //     return counter + ' ' + i + 's ago'; // plural (2 days ago)
                // }
        }
    }

    return value;
}

}
