import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
  ) {}

  dataSource: User[] = [];
  page: number = 1;
  skip: number = 0;
  filter: string = '';
  searchForm!: FormGroup;
  isSearchState: boolean = false;

  ngOnInit() {
    this.userService
      .getAllUsers(this.page)
      .pipe(
        map((result) => {
          this.dataSource = (result as any).items;
        })
      )
      .subscribe();

    this.searchForm = this.formBuilder.group({
      filter: [''],
    });
  }

  loadMore() {
    this.page = this.page + 1;
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

  search(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    this.filter = form.value.filter;
    this.userService
      .searchUsers(this.filter, this.skip)
      .pipe(
        // clear dataSource and append result
        map((result) => {
          this.dataSource = result as any;
        })
      )
      .subscribe();
    this.isSearchState = true;
  }

  loadMoreSearch() {
    this.skip = this.skip + 10;
    this.userService
      .searchUsers(this.filter, this.skip)
      .pipe(
        map((result) => {
          this.dataSource = [...this.dataSource, ...(result as any)];
        })
      )
      .subscribe();
  }
}
