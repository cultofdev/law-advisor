import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let request;

    request = req.clone({
      setHeaders: {
        'Authorization': `${localStorage.getItem('access_token')}`,
        'Accept': 'application/json; charset=utf-8'
      }
    });

    return next.handle(request);
  }
}
