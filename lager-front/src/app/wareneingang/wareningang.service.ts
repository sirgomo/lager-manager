import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto } from '../dto/lagerPlatz.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';
import { WarenEinArtikleDto } from '../dto/warenEinArtikle.dto';

@Injectable({
  providedIn: 'root'
})
export class WareningangService {
  private API_URL :string = 'http://localhost:3000/wareneingang';
  constructor(private http: HttpClient) { }
   getAllLiferungen():Observable<WarenBuchungDto[]>{
    return this.http.get<WarenBuchungDto[]>(this.API_URL);
  }
  getArtikles(liferungid: number):Observable<WarenEinArtikleDto[]>{
   return this.http.get<WarenEinArtikleDto[]>(this.API_URL + '/' + liferungid);
  }
  getPlatz(art: ArtikelMengeDto):Observable<LagerPlatztDto>{
    return this.http.post<LagerPlatztDto>(this.API_URL + '/platz', art);
  }
  legeEs(art: LagerPlatztDto):Observable<LagerPlatztDto>{
    return this.http.post<LagerPlatztDto>(this.API_URL, art);
  }
  delArtikel(artid: number, bestid: number){
    return this.http.delete(this.API_URL + '/' + artid + '/' + bestid);
  }
  updateArtikel(art: WarenEinArtikleDto){
   return this.http.post<WarenBuchungDto>(this.API_URL + '/art', art);
  }
}
