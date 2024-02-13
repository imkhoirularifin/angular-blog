import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getAllUsers(page: number) {
    return this.http.get('http://localhost:3000/api/users', {
      params: {
        page: page,
        limit: '10',
      },
    });
  }

  searchUsers(filter: string, skip: number) {
    return this.http.get('http://localhost:3000/api/users/search', {
      params: {
        filter: filter,
        skip: skip,
        take: '10',
      },
    });
  }
}
