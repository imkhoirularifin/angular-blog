import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.post<any>(
      'http://localhost:3000/api/auth/login',
      {
        usernameOrEmail: email,
        password,
      },
      {
        observe: 'response',
      }
    );
  }

  register(
    name: string,
    username: string,
    email: string,
    password: string
  ): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.post<any>(
      'http://localhost:3000/api/auth/signup',
      {
        name: name,
        username: username,
        email: email,
        password: password,
      },
      {
        observe: 'response',
      }
    );
  }
}
