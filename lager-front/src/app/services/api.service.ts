import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../dto/user.dto';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Buffer } from "buffer";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token = '';
  private jwtToken$: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.token,
  );
  Buffer = window.Buffer || Buffer;
  private API_URL = environment.APII_URL;
  constructor(
    private readonly http: HttpClient,
    private router: Router,
    private toast: ToastrService,
  ) {
    const fetchedToken: string | null = localStorage.getItem('act');
   // console.log(fetchedToken);
    if (fetchedToken !== null) {
      this.token = Buffer.from(fetchedToken, 'base64').toString('ascii');// atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }
  }

  getJwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  login(user: UserDTO) {
    const fetchedToken: string | null = localStorage.getItem('act');
 
    if (fetchedToken !== undefined && fetchedToken !== null) {
      this.jwtToken$.next('');
      localStorage.removeItem('act');
      localStorage.removeItem('role');
      localStorage.removeItem('myId');
    }
    //TODO fix subscribe
    this.http.post<any>(`${this.API_URL}auth`, user).subscribe((res) => {
      if (res.token.length > 5) {
        this.token = res.token;
       
        this.toast
          .success('login success', 'redirect now....', {
            timeOut: 600,
            positionClass: 'toast-top-center',
          })
          .onHidden.subscribe(() => {
            this.jwtToken$.next(this.token);
          //  localStorage.setItem('act', btoa(this.token));     // encode and save token in localstorage
            localStorage.setItem('act',  Buffer.from(this.token).toString('base64'));
            localStorage.setItem('role', this.getRole().toString());
            this.redirect();
          });
      }
    });
  }
  private redirect() {
    switch (this.getRole()) {
      case 'VERKAUF':
        this.router.navigateByUrl('verkauf').then();
        break;
      case 'DATAPFHLEGE':
        this.router.navigateByUrl('datenpflege').then();
        break;
      case 'LAGERVERWALTUNG':
        this.router.navigateByUrl('lager').then();
        break;
      case 'WARENEINGANG':
        this.router.navigateByUrl('warenein').then();
        break;
      case 'ADMIN':
        this.router.navigateByUrl('admin').then();
        break;
      case 'KOMMISIONIER':
        this.router.navigateByUrl('kommisionier').then();
        break;
      case 'KONTROLLER':
        this.router.navigateByUrl('kontroller').then();
        break;
      case 'WAUSGANG':
        this.router.navigateByUrl('wausgang').then();
        break;

      default:
        this.router.navigateByUrl('auth').then();
        break;
    }
  }

  logut() {
    this.token = '';
    this.jwtToken$.next(this.token);
    localStorage.removeItem('act');
    localStorage.removeItem('role');
    localStorage.removeItem('myId');
    this.toast
      .success('logout success', '', {
        timeOut: 600,
        positionClass: 'toast-top-center',
      })
      .onHidden.subscribe(() => {
        this.router.navigateByUrl('auth').then();
      });
  }
  public getRole() {
    const tok = localStorage.getItem('act');
    if(tok === null) return '';
    this.token = Buffer.from(tok, 'base64').toString('ascii');
    if(this.token.length < 1) return false;
    const jwtPayload: { username: string; role: string; id: number } =

      jwt_decode( this.token);
    
    localStorage.setItem('myId', jwtPayload.id.toString());
    return jwtPayload.role;
  }
}
