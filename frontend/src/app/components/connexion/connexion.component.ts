import { UserService } from './../../services/user.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { IssueService } from './../../services/issue.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../user.model';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  updateForm: FormGroup;
  res: any;

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  connectionSuccess(name, password) {
    const obs = this.userService.authenticate(name, password);
    obs.subscribe((data) => {
      console.log(data);
      this.res = data;
      if (!this.res.success) {
        this.snackBar.open(this.res.msg, 'OK', {
          duration: 3000
        });
      } else {
          this.snackBar.open('Connected successfully!', 'OK', {
          duration: 3000
          });
          const user = this.res.user;
          if (user.status === 'Admin') {
            this.router.navigate(['/list-user']);
          } else {
            if (user.status === 'Manager') {
            this.router.navigate([`/managing/${user._id}`]);
            } else {
            this.router.navigate([`/list/${user._id}`]);
            }
          }
      }
    });
  }
}
