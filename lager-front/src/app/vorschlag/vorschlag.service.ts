import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VorschladDto } from '../dto/vorschlag.dto';

@Injectable({
  providedIn: 'root'
})
export class VorschlagService {
  API_URL = environment.APII_URL + 'vorschlag';
  constructor(private httpCli: HttpClient) { }
  getAllVorslags() {
    return this.httpCli.get<any[]>(this.API_URL);
  }
  getVorschlagById(vorId: number) { 
    return this.httpCli.get(this.API_URL + '/' + vorId);
  }
  createVorschlag(vorschlag: VorschladDto) {
    return this.httpCli.post<number>(this.API_URL, vorschlag);
  }
  deleteVorschlag(vorschlagId: number) {
    return this.httpCli.delete<number>(this.API_URL + '/' + vorschlagId);
  }
}
