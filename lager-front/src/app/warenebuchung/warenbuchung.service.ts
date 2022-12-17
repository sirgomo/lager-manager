import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BestArtikelMengeDto } from '../dto/bestArtikelMenge.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';



@Injectable({
  providedIn: 'root'
})
export class WarenBuchungService {
  private API_URL :string = 'http://localhost:3000/warenbuchung';
  constructor( private http : HttpClient) { }

  createBestellung(best: WarenBuchungDto):Observable<WarenBuchungDto>{

      return  this.http.post<WarenBuchungDto>(this.API_URL, best);

  }
  addArtikel(art: BestArtikelMengeDto):Observable<BestArtikelMengeDto>{

    return  this.http.post<BestArtikelMengeDto>(this.API_URL + '/art', art);

  }
  getAllArtiklesInBestellung(bestellungId: number):Observable<BestArtikelMengeDto[]>{

    return  this.http.get<BestArtikelMengeDto[]>(this.API_URL + '/'+ bestellungId );

  }
  deleteBestellung(bestellungId: number){

      return this.http.delete(this.API_URL + '/' + bestellungId);

  }
  getAllBuchungen():Observable<WarenBuchungDto[]>{

      return this.http.get<WarenBuchungDto[]>(this.API_URL);

  }
  deleteArtikel(id:number, bestid: number){

      return this.http.delete(this.API_URL + '/' + id + '/' + bestid);

  }


}
