import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ControllerKomissDataDto } from '../dto/controllerKomissData.dto';
import { PaleteForControlleDto } from '../dto/paleteForControlle.dto';

@Injectable({
  providedIn: 'root',
})
export class KontrollerService {
  private API_URL = environment.APII_URL + 'kontrolle';
  constructor(private http: HttpClient) {}
  getKommissionierungen(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  getKommByNr(id: number): Observable<ControllerKomissDataDto[]> {
    return this.http.get<ControllerKomissDataDto[]>(this.API_URL + '/' + id);
  }
  getPalattenByKommId(kommid: number): Observable<PaleteForControlleDto[]> {
    return this.http.get<PaleteForControlleDto[]>(
      this.API_URL + '/palette/' + kommid,
  );
  }
  getKommissionierbyPalId(palid: number) {
    return this.http.get<any>(this.API_URL + '/kommissionier/' + palid);
  }
  setKommissStatus(kommid: number, status: any) {
    return this.http.patch(this.API_URL + '/komm/' + kommid, status);
  }
  getPalForControleByNr(palnr: number) {
    return this.http.get<any>(this.API_URL + '/contnr/' + palnr);
  }
  setArtikelControled(artnr: number) {
    return this.http.get<number>(this.API_URL + '/art/' + artnr);
  }
  setLkwNr(palid: number, lkwnr: number) {
    return this.http.get<number>(this.API_URL + '/lkw/'+palid+'/'+lkwnr);
  }
}
