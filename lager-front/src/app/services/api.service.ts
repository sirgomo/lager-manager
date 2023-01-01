import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../dto/user.dto';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token = '';
  private jwtToken$: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.token,
  );
  private API_URL = 'http://localhost:3000/';
  constructor(
    private readonly http: HttpClient,
    private router: Router,
    private toast: ToastrService,
  ) {
    const fetchedToken: string | null = localStorage.getItem('act');
    if (fetchedToken) {
      this.token = atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }
  }

  getJwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  login(user: UserDTO) {
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
            localStorage.setItem('act', btoa(this.token));
            localStorage.setItem('role', this.getRole().toString());

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

              default:
                this.router.navigateByUrl('auth').then();
                break;
            }
          });
      }
    });
    /*  this.http.post<any>(`${this.API_URL}auth`, user).subscribe(
      (res: { token: string }) => {
        this.token = res.token;
        if (this.token) {
          this.toast
            .success('login success', 'redirect now....', {
              timeOut: 600,
              positionClass: 'toast-top-center',
            })
            .onHidden.subscribe(() => {
              this.jwtToken$.next(this.token);
              localStorage.setItem('act', btoa(this.token));
              localStorage.setItem('role', this.getRole().toString());

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

                default:
                  this.router.navigateByUrl('auth').then();
                  break;
              }
            });
        }
      },
      (err: HttpErrorResponse) => console.log(err.message),
    );*/
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
    const jwtPayload: { username: string; role: string; id: number } =
      jwt_decode(this.token);
    localStorage.setItem('myId', jwtPayload.id.toString());
    return jwtPayload.role;
  }
}
