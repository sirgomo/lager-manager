import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KomissDTO } from '../dto/komiss.dto';

@Injectable({
  providedIn: 'root',
})
export class KontrollerService {
  private API_URL = 'http://localhost:3000/kontrolle';
  constructor(private http: HttpClient) {}
  getKommissionierungen() {
    return this.http.get<any>(this.API_URL);
  }
}
