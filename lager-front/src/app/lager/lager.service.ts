import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
      throw new Error("Problem with Api Lagerverwaltung");

    }

  }
}
