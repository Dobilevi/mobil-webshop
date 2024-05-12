import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mobile } from '../model/Mobile';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(private http: HttpClient) {

  }

  uploadMobile(mobile: Mobile) {
    const body = new URLSearchParams();
    body.set('name', mobile.name);
    body.set('modelName', mobile.modelName);
    body.set('company', mobile.company);
    body.set('picture', mobile.picture);
    body.set('price', mobile.price.toString());
    body.set('stock', mobile.stock.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/uploadMobile', body, { headers: headers, withCredentials: true });
  }

  getAll(search: string) {
    return this.http.get<Mobile[]>('http://localhost:5000/app/getAllMobiles/' + search);
  }

  getMobile(modelName: string) {
    return this.http.get<Mobile>('http://localhost:5000/app/getMobile/' + modelName);
  }

  deleteMobile(modelName: string) {
    return this.http.delete('http://localhost:5000/app/deleteMobile/' + modelName, {withCredentials: true});
  }

  initMobiles() {
    return this.http.post('http://localhost:5000/app/initMobiles', {});
  }
}
