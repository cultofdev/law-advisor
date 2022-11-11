import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(url: string, params: any) {
    return this.httpClient.get(url, {params: params});
  }

  post(url: string, data: any) {
    return this.httpClient.post(url, data);
  }

  put(url: string, data: any) {
    return this.httpClient.put(url, data);
  }

  delete(url: string, params: any) {
    return this.httpClient.delete(url, {params: params});
  }
}
