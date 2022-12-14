import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DispositorDto } from '../dto/dispositor.dto';
import { SpeditionDto } from '../dto/spedition.dto';

@Injectable({
  providedIn: 'root'
})
export class DatenpflegeService {

  private API_URL :string = 'http://localhost:3000/dispo';
  private API_URLS :string = 'http://localhost:3000/sped';
  constructor(private http: HttpClient) { }

  getAllDispositors():Observable<DispositorDto[]>{
        return this.http.get<DispositorDto[]>(this.API_URL);
  }
  createNewDispositor(dispo : DispositorDto):Observable<DispositorDto>{
        return this.http.post<DispositorDto>(this.API_URL, dispo);
  }
  updateDispositor(dispo: DispositorDto, id : number){
      this.http.patch<DispositorDto>(this.API_URL + '/'+id, dispo).subscribe();
  }
  deleteDispositor(id:number){
      this.http.delete(this.API_URL + '/' + id).subscribe();
  }

  getAllSpeditions():Observable<SpeditionDto[]>{
      return this.http.get<SpeditionDto[]>(this.API_URLS);
  }
  createNewSpeditor(sped : SpeditionDto):Observable<SpeditionDto>{
      return this.http.post<SpeditionDto>(this.API_URLS, sped);
  }
   updateSpeditor(sped: SpeditionDto, id:number){
     return this.http.post<SpeditionDto>(this.API_URLS + '/'+id, sped);
  }
  deleteSpeditor(id:number){
      this.http.delete(this.API_URLS + '/'+id).subscribe();
  }
}
