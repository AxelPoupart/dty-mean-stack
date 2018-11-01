import { User } from './../../user.model';
import { UserService } from './../../services/user.service';
import { Issue } from './../../issue.model';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id: String;
  user: User;
  updateForm: FormGroup;

  constructor(private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.userService.getUserById(this.id).subscribe((res: User) => {
        this.user = res;
        this.updateForm.get('name').setValue(this.user.name);
        this.updateForm.get('manager').setValue(this.user.manager);
        this.updateForm.get('status').setValue(this.user.status);
        console.log(this.user);
      });
    });

  }

  createForm() {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      manager: '',
      status: ''
    });
   }

   updateUser(name, manager, status) {
    console.log(this.user);
    if (!status) {
      this.userService.updateUser(this.id, name, this.user.password, manager, this.user.status).subscribe(() => {
        this.snackBar.open('Issue updated successfully!', 'OK', {
          duration: 3000
        });
        this.router.navigate(['/list-user']);
      });
    } else {
      this.userService.updateUser(this.id, name, this.user.password, manager, status).subscribe(() => {
        this.snackBar.open('Issue updated successfully!', 'OK', {
          duration: 3000
        });
      this.router.navigate(['/list-user']);
      });
    }
  }
}
