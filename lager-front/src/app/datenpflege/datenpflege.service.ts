import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dispositorDTO } from '../dto/dispositor.dto';
import { speditionDTO } from '../dto/spedition.dto';

@Injectable({
  providedIn: 'root'
})
export class DatenpflegeService {

  private API_URL :string = 'http://localhost:3000/dispo';
  private API_URLS :string = 'http://localhost:3000/sped';
  constructor(private http: HttpClient) { }

  getAllDispositors():Observable<dispositorDTO[]>{
    return this.http.get<dispositorDTO[]>(this.API_URL);
  }
  createNewDispositor(dispo : dispositorDTO):Observable<dispositorDTO>{
   return this.http.post<dispositorDTO>(this.API_URL, dispo);
  }
  updateDispositor(dispo: dispositorDTO, id : number):Observable<dispositorDTO>{
   return this.http.post<dispositorDTO>(this.API_URL + '/'+id, dispo);
  }
  deleteDispositor(id:number){
    this.http.delete(this.API_URL + '/' + id);
  }

  getAllSpeditions():Observable<speditionDTO[]>{
    return this.http.get<speditionDTO[]>(this.API_URLS);
  }
  createNewSpeditor(sped : speditionDTO):Observable<speditionDTO>{
    return this.http.post<speditionDTO>(this.API_URLS, sped);
  }
  updateSpeditor(sped: speditionDTO, id:number):Observable<speditionDTO>{
    return this.http.post<speditionDTO>(this.API_URLS + '/'+id, sped);
  }
  deleteSpeditor(id:number){
    this.http.delete(this.API_URLS + '/'+id);
  }
}
