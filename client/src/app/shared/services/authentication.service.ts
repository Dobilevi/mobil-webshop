import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedInVar: boolean = false;
  isAdminVar: boolean = false;

  constructor(private http: HttpClient) {
    this.update();
  }

  update() {
    this.isLoggedIn().subscribe({
      next: isLoggedIn => {
        this.isLoggedInVar = isLoggedIn;
        if (this.isLoggedInVar) {
          this.isAdmin().subscribe({
            next: (isAdmin) => {
              this.isAdminVar = isAdmin;
            }, error: (err) => {
              console.log(err);
            }
          });
        } else {
          this.isAdminVar = false;
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<User>('http://localhost:5000/app/login', body, { headers: headers, withCredentials: true });
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set('username', user.username);
    body.set('email', user.email);
    body.set('name', user.name);
    body.set('address', user.address);
    body.set('password', user.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/register', body, { headers: headers, withCredentials: true });
  }

  logout() {
    return this.http.post('http://localhost:5000/app/logout', {}, { withCredentials: true, responseType: 'text' });
  }

  isLoggedIn() {
    return this.http.get<boolean>('http://localhost:5000/app/isLoggedIn', { withCredentials: true });
  }

  isAdmin() {
    return this.http.get<boolean>('http://localhost:5000/app/isAdmin', { withCredentials: true });
  }

  getUser() {
    return this.http.get<User>('http://localhost:5000/app/getUser', { withCredentials: true });
  }

  updateUser(user: User) {
    const body = new URLSearchParams();
    if (user.username) {
      body.set('username', user.username);
    }
    if (user.name) {
      body.set('name', user.name);
    }
    if (user.address) {
      body.set('address', user.address);
    }
    if (user.password) {
      body.set('password', user.password);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/updateUser', body, { headers: headers, withCredentials: true });
  }

  deleteUser() {
    return this.http.delete('http://localhost:5000/app/deleteUser', { withCredentials: true });
  }

  initUsers() {
    return this.http.post('http://localhost:5000/app/initUsers', {});
  }
}
