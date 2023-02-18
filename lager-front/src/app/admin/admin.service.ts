import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirmaSettingsDto } from '../dto/firma.dto';
import { RegisterUsersDto } from '../dto/regUsers.dto';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private API_URL :string =  environment.APII_URL+ 'admin';
  private API_FURL :string =  environment.APII_URL+ 'firm';
  constructor(private http : HttpClient) { }
  getUsers():Observable<RegisterUsersDto[]>{
    return this.http.get<RegisterUsersDto[]>(this.API_URL + '/users');
  }
  createUser(user:RegisterUsersDto):Observable<RegisterUsersDto>{
    return this.http.post<RegisterUsersDto>(this.API_URL + '/newuser' , user);
  }
  deleteUser(userid:number){
    return this.http.delete(this.API_URL + '/users/' + userid);
  }
  getFirm() {
    return this.http.get<FirmaSettingsDto>(this.API_FURL);
  }
  setupFirm(data: FirmaSettingsDto) { 
    return this.http.post<number>(this.API_FURL + '/create', data);
  }
  updateFirmData(data: FirmaSettingsDto) {
    return this.http.patch<number>(this.API_FURL + '/update', data);
  }
}
