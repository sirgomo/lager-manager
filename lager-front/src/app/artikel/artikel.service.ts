import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtikelDTO } from '../dto/artikel.dto';

@Injectable({
  providedIn: 'root',
})
export class ArtikelService {
  private API_URL = 'http://localhost:3000/artikel';
  constructor(private http: HttpClient) {}

  getAllArtikel(): Observable<ArtikelDTO[]> {
    return this.http.get<ArtikelDTO[]>(this.API_URL);
  }
  createArtikel(art: ArtikelDTO): Observable<ArtikelDTO> {
    return this.http.post<ArtikelDTO>(this.API_URL, art);
  }
  deleteArtikel(id: number) {
    return this.http.delete(this.API_URL + '/' + id);
  }
  getArtikelById(id: number) {
    return this.http.get<ArtikelDTO>(this.API_URL + '/' + id);
  }
  updateArtikel(art: ArtikelDTO): Observable<ArtikelDTO> {
    return this.http.patch<ArtikelDTO>(this.API_URL, art);
  }
}
