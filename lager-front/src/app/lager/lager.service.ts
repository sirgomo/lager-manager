import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto } from '../dto/lagerPlatz.dto';

@Injectable({
  providedIn: 'root'
})
export class LagerService {
  private API_URL :string = 'http://localhost:3000/lager';
  constructor(private http: HttpClient) { }

  getAllStellpletze(){
    try{
      return this.http.get<LagerPlatztDto[]>(this.API_URL);
    }catch(err){
      throw new Error("Problem with Api Lagerverwaltung" + err);

    }

  }
  getPlatztFurArtikel(art : ArtikelMengeDto){
    try{
      return this.http.post<LagerPlatztDto>(this.API_URL +'/art', art);
    }catch(err){
      throw new Error("Problem with Api Lagerverwaltung" + err);
    }
  }
  createPlatz(platz: LagerPlatztDto){
    try{
      return this.http.post<LagerPlatztDto>(this.API_URL , platz);
    }catch(err){
      throw new Error("Problem with Api Lagerverwaltung" + err);
    }
  }
  deletePlatz(id: number){
    try{
      return this.http.delete(this.API_URL + '/' + id);
    }catch(err){
      throw new Error("Problem with Api Lagerverwaltung" + err);
    }
  }
}
