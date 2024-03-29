import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DispositorDto } from '../dto/dispositor.dto';
import { SpeditionDto } from '../dto/spedition.dto';

@Injectable({
  providedIn: 'root',
})
export class DatenpflegeService {
  private API_URL =  environment.APII_URL +  'dispo';
  private API_URLS = environment.APII_URL + 'sped';
  constructor(private http: HttpClient) {}

  getAllDispositors(): Observable<DispositorDto[]> {
    return this.http.get<DispositorDto[]>(this.API_URL);
  }
  createNewDispositor(dispo: DispositorDto): Observable<DispositorDto> {
    return this.http.post<DispositorDto>(this.API_URL, dispo);
  }
  updateDispositor(dispo: DispositorDto, id: number) {
    this.http.patch<DispositorDto>(this.API_URL + '/' + id, dispo).subscribe();
  }
  deleteDispositor(id: number) {
    return this.http.delete(this.API_URL + '/' + id);
  }

  getAllSpeditions(): Observable<SpeditionDto[]> {
    return this.http.get<SpeditionDto[]>(this.API_URLS);
  }
  createNewSpeditor(sped: SpeditionDto): Observable<SpeditionDto> {
    return this.http.post<SpeditionDto>(this.API_URLS, sped);
  }
  updateSpeditor(sped: SpeditionDto, id: number) {
    return this.http.post<SpeditionDto>(this.API_URLS + '/' + id, sped);
  }
  deleteSpeditor(id: number) {
    this.http.delete(this.API_URLS + '/' + id).subscribe();
  }
}
