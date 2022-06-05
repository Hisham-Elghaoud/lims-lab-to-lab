import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {

  transform(value: any,key: string , ...args: any[]): any {
    return (value || []).find(one => one[key]) || null;
  }

}
