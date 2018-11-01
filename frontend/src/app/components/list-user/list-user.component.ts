import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Issue } from '../../issue.model';
import { User } from '../../user.model';

import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  id: String;
  admin: User;
  users: User[];
  displayedColumns = ['name', 'manager', 'status', 'actions'];


  constructor(private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchUsers();

  }

  fetchUsers() {
    this.userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
      console.log('Data requested...');
      console.log(res);
    });
  }

  editUser(id) {
    this.router.navigate([`/edit-user/${id}`]);
  }

  deleteUser(id) {
    this.userService.deleteUser(id).subscribe(() => {
      this.fetchUsers();
    });
  }

  createUser() {
    this.router.navigate(['/create-user']);
  }

}
