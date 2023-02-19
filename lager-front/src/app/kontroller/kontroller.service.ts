import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ControllerKomissDataDto } from '../dto/controllerKomissData.dto';
import { ARTIKELSTATUS } from '../dto/kommissDetails.dto';
import { PaleteForControlleDto } from '../dto/paleteForControlle.dto';
import { PaleteToDruckDto } from '../dto/paleteToDruck.dto';

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
    return this.http.patch<number>(this.API_URL + '/lkw/'+palid+'/'+lkwnr, '');
  }
  getPaleteToDruck(palid: number, kommId: number) {
    return this.http.get<PaleteToDruckDto[]>(this.API_URL + '/druck/'+palid + '/' + kommId);
  }
  getPalettenToDruck(kommId: number) { 
    return this.http.get<PaleteToDruckDto[]>(this.API_URL + '/druckall/' + kommId);
  }
  setPaleteTyp(palid: number, paltyp: string) {
    return this.http.patch<any>(this.API_URL + '/palt/' + palid + '/' + paltyp, '');
  }
  setPaleteGewicht(palid: number, palge: number) {
    return this.http.patch<any>(this.API_URL + '/palg/' + palid + '/' + palge, '');
  }
  setNewArtikelStatus(artid : number, status: any) {
    return this.http.patch<any>(this.API_URL + '/artstatus/' + artid, status);
  }
  setNewArtikelMenge(artid: number, menge: number) {
    return this.http.patch<any>(this.API_URL + '/artmenge/' + artid + '/' + menge, '');
  }
 
}
