import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AddArtikelKommissDto } from '../dto/addArtikelKommiss.dto';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import {KomissDTO} from '../dto/komiss.dto'
import { UserDataDto } from '../dto/userData.dto';

@Injectable({
  providedIn: 'root'
})
export class VerkaufService {
  constructor(private http : HttpClient){}
  private API_URL :string = 'http://localhost:3000/verkauf';

  getAll():Observable<KomissDTO[]>{
   return this.http.get<KomissDTO[]>(this.API_URL);

  }

  createKommissionierung(komissDTO : KomissDTO):Observable<KomissDTO>{
    return this.http.post<KomissDTO>(this.API_URL + '/new', komissDTO);
  }
  updateKomm(komiss: KomissDTO){
    return this.http.put(this.API_URL + '/up', komiss);
  }
  deleteKommissionierung(id:number){
   return this.http.delete(this.API_URL + '/' +id);
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
  addArtikelToKomm(art: AddArtikelKommissDto[]):Observable<AddArtikelKommissDto[]>{
    return this.http.post<AddArtikelKommissDto[]>(this.API_URL + '/addart', art);
  }
  deletePosInKom(id:number){
    return this.http.delete(this.API_URL + '/detaId/' + id);
  }
  getTotalGewichtAndPaleten(kommnr:number){
    return this.http.get<any>(this.API_URL + '/total/' + kommnr);
  }
  getUserById(id:number){
    return this.http.get<UserDataDto>('http://localhost:3000/user/' +id);
  }
}
