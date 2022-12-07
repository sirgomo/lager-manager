import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNullItemPipe'
})
export class FilterNullItemPipePipe implements PipeTransform {

  transform(values: any[], ...args: unknown[]): any[] {
    return values.filter(d => (d !== null || d !== undefined));
  }

}
