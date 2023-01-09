import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerKomissDataDto } from '../dto/controllerKomissData.dto';

@Injectable({
  providedIn: 'root',
})
export class KontrollerService {
  private API_URL = 'http://localhost:3000/kontrolle';
  constructor(private http: HttpClient) {}
  getKommissionierungen(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  getKommByNr(id: number): Observable<ControllerKomissDataDto[]> {
    return this.http.get<ControllerKomissDataDto[]>(this.API_URL + '/' + id);
  }
  getPalattenByKommId(kommid: number): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + '/palette/' + kommid);
  }
  getKommissionierbyPalId(palid: number) {
    return this.http.get<any>(this.API_URL + '/kommissionier/' + palid);
  }
  setKommissStatus(kommid: number, status: any) {
    return this.http.patch(this.API_URL + '/komm/' + kommid, status);
  }
}
