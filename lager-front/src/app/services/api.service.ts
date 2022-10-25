import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { userDTO } from '../dto/user.dto';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token : string = '';
  private jwtToken$ : BehaviorSubject<string> = new BehaviorSubject<string>(this.token);
  private API_URL :string = 'http://localhost:3000/';
  constructor(private readonly http: HttpClient,
              private router: Router,
              private toast: ToastrService) {
              const fetchedToken : string | null = localStorage.getItem('act');
              if(fetchedToken){
                this.token = atob(fetchedToken);
                this.jwtToken$.next(this.token);
              }

              }

  getJwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  /*getAllArtickels():Observable<any>{
    return this.http.get(`${this.API_URL}/artikel`,{
    headers : {
      Authorization : `Bearer ${this.token}`
    }});
  }*/
  login(user: userDTO){
   this.http.post<any>(`${this.API_URL}auth`, user)
   .subscribe((res : {token :string }) => {
    this.token = res.token;
    if(this.token){
      this.toast.success('login success', 'redirect now....', {
        timeOut: 600,
        positionClass: 'toast-top-center'
      }).onHidden.subscribe(()=> {
          this.jwtToken$.next(this.token);
          localStorage.setItem('act', btoa(this.token));
          switch (this.getRole()) {
            case 'VERKAUF':
              this.router.navigateByUrl('verkauf').then();
              break;
              case 'WARENPFHLEGE':
              this.router.navigateByUrl('datenpflege').then();
              break;

            default:
              this.router.navigateByUrl('auth').then();
              break;
          }

      });

    }
   }, (err: HttpErrorResponse)=> console.log(err.message));
  }
  logut(){
    this.token = '';
    this.jwtToken$.next(this.token);
    localStorage.removeItem('act');
    this.toast.success('logout success', '', {
      timeOut: 600,
      positionClass: 'toast-top-center'
    }).onHidden.subscribe(() =>{
      this.router.navigateByUrl('auth').then();
    });

  }
  public getRole(){
    const jwtPayload : {username : string, role : string, id : number }  = jwt_decode(this.token);
   return jwtPayload.role;
  }
}
