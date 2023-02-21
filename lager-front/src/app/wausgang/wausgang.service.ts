import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WausgangService {
  private API_URL = environment.APII_URL + 'wausgang'; 
  constructor( private http: HttpClient) { }
  getFertigKommissionierungen() { 
    return this.http.get<any>(this.API_URL);
  }
}
