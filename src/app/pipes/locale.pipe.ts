import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'locale'
})
export class LocalePipe implements PipeTransform {

  constructor(private data:DataService, private language:LanguageService){}

  transform(value: string, key = 1, ...args: unknown[]): unknown {
    return this.language['languages_' + key][this.data.language][value.toLocaleLowerCase()] || value;
  }

}
