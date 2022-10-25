import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {KomissDTO} from '../dto/komiss.dto'

@Injectable({
  providedIn: 'root'
})
export class VerkaufService {
  constructor(private http : HttpClient){}
  private API_URL :string = 'http://localhost:3000/komi';

  getAll():Observable<KomissDTO[]>{
   return this.http.get<KomissDTO[]>(this.API_URL + '/getall');

  }
  getMeine():Observable<KomissDTO[]>{
    return this.http.get<KomissDTO[]>(this.API_URL);
  }
  createKommissionierung(KomissDTO : KomissDTO):Observable<KomissDTO>{
    return this.http.post<KomissDTO>(this.API_URL, KomissDTO);
  }
  deleteKommissionierung(id:number){
    this.http.delete(this.API_URL + '/' +id);
    return this.getMeine();
  }
}
