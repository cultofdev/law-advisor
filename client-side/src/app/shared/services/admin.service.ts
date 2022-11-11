import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  checkEmail(url: string, params: any) {
    return this.httpClient.get<User[]>(url, {params: params}).pipe(
      map(x => x.filter(y => y.username === params.username))
    );
  }

  post(url: string, data: any) {
    return this.httpClient.post(url, data);
  }
}
