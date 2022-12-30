import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtikelAufPaletteDto } from '../dto/artikelAufPalete.dto';
import { DataFurKomisDto } from '../dto/dataFurKomis.dto';
import { NeuePaletteDto } from '../dto/neuePalette.dto';

@Injectable({
  providedIn: 'root',
})
export class KommisionierService {
  private API_URL = 'http://localhost:3000/komi';
  constructor(private http: HttpClient) {}

  getKommissionierung(kommid: number): Observable<DataFurKomisDto[]> {
    return this.http.get<DataFurKomisDto[]>(this.API_URL + '/' + kommid);
  }
  paletteErstellen(pal: NeuePaletteDto): Observable<number> {
    return this.http.post<number>(this.API_URL + '/neupal', pal);
  }
  gewichtErfassen(pal: NeuePaletteDto): Observable<number> {
    return this.http.post<number>(this.API_URL + '/gerf', pal);
  }
  getLastActiveKomm(kommisionierid: number) {
    return this.http.get(this.API_URL + '/lastkomm/' + kommisionierid, {
      responseType: 'text',
    });
  }
  addArtikelAufPalette(art: ArtikelAufPaletteDto): Observable<number> {
    return this.http.post<number>(this.API_URL + '/art', art);
  }
  getPlatzMitArtikels(artid: number, liferid: number): Observable<any> {
    return this.http.get<any>(
      this.API_URL + '/artikel/' + artid + '/' + liferid,
    );
  }
  getArtikelMenge(artid: number, liferid: number): Observable<any> {
    return this.http.get<any>(this.API_URL + '/menge/' + artid + '/' + liferid);
  }
  lagerPlatzNachfullen(staticid: number, hid: number): Observable<any> {
    return this.http.get<any>(this.API_URL + '/platz/' + staticid + '/' + hid);
  }
  getMengeOnPlatzId(platzid: number) {
    return this.http.get<number>(this.API_URL + '/platz/' + platzid);
  }
}
