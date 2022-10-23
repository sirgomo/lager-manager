import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private api : ApiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token : string = '';
     this.api.getJwtUserToken().subscribe(dat =>{
      token = dat;
     });

    const modifiedReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(modifiedReq);
  }
}
