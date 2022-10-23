import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {komissDTO} from '../dto/komiss.dto'

@Injectable({
  providedIn: 'root'
})
export class VerkaufService {
  constructor(private http : HttpClient){}
  private API_URL :string = 'http://localhost:3000/komi';

  getAll():Observable<komissDTO[]>{
   return this.http.get<komissDTO[]>(this.API_URL + '/getall');

  }
  getMeine():Observable<komissDTO[]>{
    return this.http.get<komissDTO[]>(this.API_URL);
  }
  createKommissionierung(komissDTO : komissDTO):Observable<komissDTO>{
    return this.http.post<komissDTO>(this.API_URL, komissDTO);
  }
  deleteKommissionierung(id:number){
    this.http.delete(this.API_URL + '/' +id);
    return this.getMeine();
  }
}
