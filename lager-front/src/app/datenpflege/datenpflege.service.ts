import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DispositorDTO } from '../dto/dispositor.dto';
import { SpeditionDTO } from '../dto/spedition.dto';

@Injectable({
  providedIn: 'root'
})
export class DatenpflegeService {

  private API_URL :string = 'http://localhost:3000/dispo';
  private API_URLS :string = 'http://localhost:3000/sped';
  constructor(private http: HttpClient) { }

  getAllDispositors():Observable<DispositorDTO[]>{
        return this.http.get<DispositorDTO[]>(this.API_URL);
  }
  createNewDispositor(dispo : DispositorDTO):Observable<DispositorDTO>{
        return this.http.post<DispositorDTO>(this.API_URL, dispo);
  }
  updateDispositor(dispo: DispositorDTO, id : number){
    try{
      this.http.patch<DispositorDTO>(this.API_URL + '/'+id, dispo).subscribe();
    }catch(error){
      throw new HttpErrorResponse({error});
    }

  }
  deleteDispositor(id:number){
      this.http.delete(this.API_URL + '/' + id).subscribe();
  }

  getAllSpeditions():Observable<SpeditionDTO[]>{
    try{
      return this.http.get<SpeditionDTO[]>(this.API_URLS);
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
  createNewSpeditor(sped : SpeditionDTO):Observable<SpeditionDTO>{
    try{
      return this.http.post<SpeditionDTO>(this.API_URLS, sped);
    }catch(error){
      throw new HttpErrorResponse({error});
    }

  }
   updateSpeditor(sped: SpeditionDTO, id:number){
     try{
      this.http.post<SpeditionDTO>(this.API_URLS + '/'+id, sped).subscribe();
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
  deleteSpeditor(id:number){
    try{
      this.http.delete(this.API_URLS + '/'+id).subscribe();
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
}
