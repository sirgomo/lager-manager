import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import {KomissDTO} from '../dto/komiss.dto'

@Injectable({
  providedIn: 'root'
})
export class VerkaufService {
  constructor(private http : HttpClient){}
  private API_URL :string = 'http://localhost:3000/verkauf';

  getAll():Observable<KomissDTO[]>{
   return this.http.get<KomissDTO[]>(this.API_URL);

  }

  createKommissionierung(KomissDTO : KomissDTO):Observable<KomissDTO>{
    return this.http.post<KomissDTO>(this.API_URL + '/new', KomissDTO);
  }
  deleteKommissionierung(id:number){
    this.http.delete(this.API_URL + '/' +id);
  }
  getAllByVerkufer(verkuferid: number):Observable<KomissDTO[]>{
    return this.http.get<KomissDTO[]>(this.API_URL + '/'+verkuferid);
  }

  getArtikles():Observable<ArtikelKommissDto[]>{
    try{
      //get not working here why ???
      return this.http.post<any>(this.API_URL + '/art', '');
    }catch(err){
    throw err;
    }
  }
  getCurrentVerfugbareMenge(artId: number):Observable<ArtikelKommissDto>{
    return this.http.get<ArtikelKommissDto>(this.API_URL + '/art/' + artId);
  }
}
