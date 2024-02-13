import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getAllUsers(page: string) {
    return this.http.get('http://localhost:3000/api/users', {
      params: {
        page: page,
        limit: '2',
      },
    });
  }
}
