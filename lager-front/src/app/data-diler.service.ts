import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KomissDTO } from './dto/komiss.dto';

@Injectable({
  providedIn: 'root'
})
export class DataDilerService {
  private komm :KomissDTO = new KomissDTO();
  constructor() {

   }
public setKomm(komm:KomissDTO){
  this.komm = komm;
}
getKomm():KomissDTO{
  return this.komm;
}

}
