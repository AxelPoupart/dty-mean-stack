import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      password: '',
      manager: '',
      status: ''
    });
  }

  addUser(name, password, manager, status) {
    this.userService.addUser(name, password, manager, status).subscribe(() => {
      this.snackBar.open('Added successfully!', 'OK', {
        duration: 3000
        });
      this.router.navigate(['/list-user']);
    });
  }

  ngOnInit() {
  }

}
