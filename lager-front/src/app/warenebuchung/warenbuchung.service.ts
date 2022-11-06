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
    try{
      return  this.http.post<WarenBuchungDto>(this.API_URL, best);
    }catch(err){
      throw new Error("Es gibt problem im warenBuchung");
    }
  }
  addArtikel(art: BestArtikelMengeDto):Observable<BestArtikelMengeDto>{
    try{
    return  this.http.post<BestArtikelMengeDto>(this.API_URL + '/art', art);
    }catch(err){
      throw new Error("Es gibt problem im warenBuchung");
    }
  }
  getAllArtiklesInBestellung(bestellungId: number):Observable<BestArtikelMengeDto[]>{
    try{
    return  this.http.get<BestArtikelMengeDto[]>(this.API_URL + '/'+ bestellungId );
    }catch(err){
      throw new Error("Es gibt problem im warenBuchung");
    }
  }
  deleteBestellung(bestellungId: number){
    try{
      return this.http.delete(this.API_URL + '/' + bestellungId);
    }catch(err){
      throw new Error("Es gibt problem im warenBuchung");
    }
  }
  getAllBuchungen():Observable<WarenBuchungDto[]>{
    try{
      return this.http.get<WarenBuchungDto[]>(this.API_URL);
    }catch(err){
      throw new Error("Es gibt problem im warenBuchung : getbuchungen");
    }
  }
  deleteArtikel(id:number, bestid: number){
    try{
      return this.http.delete(this.API_URL + '/' + id + '/' + bestid);
    }catch(err){
      throw new Error("Es gibt problem im warenbuchung : deleteArtikel")
    }
  }


}
