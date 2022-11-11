import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class LaderInterceptorInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = new Array();

  constructor(private loaderSer: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   // return next.handle(request);
   this.requests.push(request);
    //let subscrition: Observable<HttpEvent<any>> =
    this.loaderSer.isLoading.next(true);
    return new Observable(observer =>{
      const subscrition = next.handle(request)
      .subscribe({next: (data) => {
        if(data instanceof HttpResponse){
          this.removeRequest(request);
          observer.next(data);
        }
      }, error: (err) => {
        alert('error '+ err);
        console.log(err);
        this.removeRequest(request);
        subscrition.unsubscribe();
      },
      complete: ()=> {
        this.removeRequest(request);
        observer.complete();
      }});
      return () =>{
        this.removeRequest(request);
        subscrition.unsubscribe();
      }
    });

  }
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderSer.isLoading.next(this.requests.length > 0);
  }

}
