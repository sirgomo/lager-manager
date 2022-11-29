import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUsersDto } from '../dto/regUsers.dto';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private API_URL :string = 'http://localhost:3000/admin';
  constructor(private http : HttpClient) { }
  getUsers():Observable<RegisterUsersDto[]>{
    return this.http.get<RegisterUsersDto[]>(this.API_URL + '/users');
  }
  createUser(user:RegisterUsersDto):Observable<RegisterUsersDto>{
    return this.http.post<RegisterUsersDto>(this.API_URL + '/newuser' , user);
  }
}
