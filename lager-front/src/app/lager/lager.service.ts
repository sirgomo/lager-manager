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
      return this.http.get<LagerPlatztDto[]>(this.API_URL);
  }
  getPlatztFurArtikel(art : ArtikelMengeDto){
      return this.http.post<LagerPlatztDto>(this.API_URL +'/art', art);
  }
  createPlatz(platz: LagerPlatztDto){
      return this.http.post<LagerPlatztDto>(this.API_URL , platz);
  }
  deletePlatz(id: number){
      return this.http.delete(this.API_URL + '/' + id);
  }
}
