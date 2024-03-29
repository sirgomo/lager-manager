import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddArtikelKommissDto } from '../dto/addArtikelKommiss.dto';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import { ArtikelSchiebenDto } from '../dto/artikelSchieben.dto';
import { KomissDTO } from '../dto/komiss.dto';
import { UserDataDto } from '../dto/userData.dto';

@Injectable({
  providedIn: 'root',
})
export class VerkaufService {
  constructor(private http: HttpClient) {}
  private API_URL = environment.APII_URL + 'verkauf';

  getAll(): Observable<KomissDTO[]> {
    return this.http.get<KomissDTO[]>(this.API_URL);
  }

  createKommissionierung(komissDTO: KomissDTO): Observable<KomissDTO> {
    return this.http.post<KomissDTO>(this.API_URL + '/new', komissDTO);
  }
  updateKomm(komiss: KomissDTO) {
    return this.http.patch(this.API_URL + '/up', komiss);
  }
  deleteKommissionierung(id: number) {
    return this.http.delete(this.API_URL + '/' + id);
  }
  getAllByVerkufer(verkuferid: number): Observable<KomissDTO[]> {
    return this.http.get<KomissDTO[]>(this.API_URL + '/' + verkuferid);
  }

  getArtikles(): Observable<ArtikelKommissDto[]> {
    try {
      //get not working here why ???
      return this.http.post<any>(this.API_URL + '/art', '');
    } catch (err) {
      throw err;
    }
  }
  getCurrentVerfugbareMenge(artId: number): Observable<ArtikelKommissDto> {
    return this.http.get<ArtikelKommissDto>(this.API_URL + '/art/' + artId);
  }
  addArtikelToKomm(art: AddArtikelKommissDto[]) {
    return this.http.post<AddArtikelKommissDto[]>(
      this.API_URL + '/addart',
      art,
    );
  }
  deletePosInKom(id: number) {
    return this.http.delete(this.API_URL + '/detaId/' + id);
  }
  getTotalGewichtAndPaleten(kommnr: number) {
    return this.http.get<any>(this.API_URL + '/total/' + kommnr);
  }
  getUserById(id: number) {
    return this.http.get<UserDataDto>(environment.APII_URL + 'user/' + id);
  }
  changeStatus(kommId: number, status: any) {
    return this.http.patch(this.API_URL + '/komm/' + kommId, status, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  getKommissById(id: number) {
    return this.http.get<KomissDTO>(this.API_URL + '/kommid/' + id);
  }
  getArtikelInKommiss(artid: number, liferant: number) {
    return this.http.get<any>(
      this.API_URL + '/artkom/' + artid + '/' + liferant,
    );
  }
  sendArtikelToSchieben(art: ArtikelSchiebenDto) {
    return this.http.post<KomissDTO>(this.API_URL + '/schib', art);
  }
}
