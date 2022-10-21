import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token : string = '';
  private jwtToken$ : BehaviorSubject<string> = new BehaviorSubject<string>(this.token);
  constructor(private http: HttpClient) { }

  getJwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }
}
