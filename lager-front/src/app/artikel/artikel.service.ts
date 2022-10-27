import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtikelDTO } from '../dto/artikel.dto';
import { UidDTO } from '../dto/artikel.dto';

@Injectable({
  providedIn: 'root'
})
export class ArtikelService {
  private API_URL :string = 'http://localhost:3000/artikel';
  constructor(private http: HttpClient) { }

  getAllArtikel():Observable<ArtikelDTO[]>{
    try{
      return this.http.get<ArtikelDTO[]>(this.API_URL);
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
  createArtikel(art: ArtikelDTO):Observable<ArtikelDTO>{
    try{
      return this.http.post<ArtikelDTO>(this.API_URL, art);
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
  deleteArtikel(id:number){
    try{
      return this.http.delete(this.API_URL + '/' + id);
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }
  getArtikelById(id: number){
    try{
      return this.http.get<ArtikelDTO>(this.API_URL + '/' + id);
    }catch(error){
      throw new HttpErrorResponse({error});
    }
  }

}
