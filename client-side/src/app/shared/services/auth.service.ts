import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  post(url: string, data: any): Observable<boolean> {
    return this.httpClient.post(url, data).pipe(
      map(res => {
        if(res) {
          const token = Object.assign(res);

          localStorage.setItem('isUserAuthenticated', 'true');
          localStorage.setItem('access_token', token.AccessToken);
          localStorage.setItem('refresh_token', token.RefreshToken);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userId', token.userId);

          return true;
        } else {
          return false;
        }
      })
    );
  }
}
