import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  constructor(private readonly userService: UserService) {}

  dataSource: User[] = [];

  page: string = '1';

  ngOnInit() {
    this.userService
      .getAllUsers(this.page)
      .pipe(
        map((result) => {
          this.dataSource = (result as any).items;
        })
      )
      .subscribe();
  }

  loadMore() {
    this.page = String(+this.page + 1);
    this.userService
      .getAllUsers(this.page)
      .pipe(
        map((result) => {
          // append result into datasource array
          this.dataSource = [...this.dataSource, ...(result as any).items];
        })
      )
      .subscribe();
  }
}
