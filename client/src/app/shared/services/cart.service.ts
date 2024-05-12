import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CartItem} from "../model/CartItem";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {

  }

  getCart() {
    return this.http.get<CartItem[]>('http://localhost:5000/app/getCart', { withCredentials: true });
  }

  addToCart(modelName: string, quantity: number) {
    const body = new URLSearchParams();
    body.set('modelName', modelName);
    body.set('quantity', quantity.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/addToCart', body, { headers: headers, withCredentials: true });
  }

  removeFromCart(cartItem: CartItem) {
    const body = new URLSearchParams();
    body.set('userEmail', cartItem.userEmail);
    body.set('modelName', cartItem.modelName);
    body.set('quantity', cartItem.quantity.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/removeFromCart', body, { headers: headers, withCredentials: true });
  }

  purchase(cartItems: CartItem[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post('http://localhost:5000/app/purchase', {}, { headers: headers, withCredentials: true });
  }
}
