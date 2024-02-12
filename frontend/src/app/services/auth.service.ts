import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', {
      usernameOrEmail: email,
      password,
    });
  }

  register(
    name: string,
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/signup', {
      name: name,
      username: username,
      email: email,
      password: password,
    });
  }
}
