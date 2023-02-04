import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto } from '../dto/lagerPlatz.dto';
import { LagerPlatzDtoArtNameDto } from '../dto/lagerPlatzDtoArtName.dto';

@Injectable({
  providedIn: 'root',
})
export class LagerService {
  private API_URL = environment.APII_URL + 'lager';
  constructor(private http: HttpClient) {}

  getAllStellpletze() {
    return this.http.get<any>(this.API_URL);
  }
  getPlatztFurArtikel(art: ArtikelMengeDto) {
    return this.http.post<LagerPlatzDtoArtNameDto>(this.API_URL + '/art', art);
  }
  createPlatz(platz: LagerPlatztDto) {
    return this.http.post<LagerPlatzDtoArtNameDto>(this.API_URL, platz);
  }
  deletePlatz(id: number) {
    return this.http.delete(this.API_URL + '/' + id);
  }
  getStellplaztenWithArt(artId: number, artLiferant: number) {
    return this.http.get<LagerPlatzDtoArtNameDto[]>(
      this.API_URL + '/platz' + '/' + artId + '/' + artLiferant,
    );
  }
  lagerPlatzUpdate(body: LagerPlatztDto) {
    return this.http.patch(this.API_URL, body);
  }
  getPlatzById(lagerplatzid: number) {
    return this.http.get<LagerPlatzDtoArtNameDto[]>(
      this.API_URL + '/' + lagerplatzid,
    );
  }
}
